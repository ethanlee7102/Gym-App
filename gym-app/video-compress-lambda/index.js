const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Initialize S3 client (uses Lambda's IAM role + region automatically)
const s3 = new S3Client({});

// Environment variables (set in Lambda console or Dockerfile)
const BUCKET = process.env.BUCKET_NAME;
const OUTPUT_PREFIX = process.env.OUTPUT_PREFIX || "uploads/videos/processed/";
const CRF = process.env.CRF || "23";   // lower CRF = higher quality, bigger file

// Lambda entry point
exports.handler = async (event) => {
  // S3 events contain Records; grab the first
  const rec = event.Records?.[0];
  if (!rec) return;

  // Get the S3 object key (path inside bucket)
  const key = decodeURIComponent(rec.s3.object.key); // e.g. uploads/videos/raw/filename.mp4

  const baseName = path.basename(key); //get just the file name

  // Lambda can only write to /tmp, so we stage files there
  const inPath = "/tmp/in.mp4";
  const outPath = "/tmp/out.mp4";

  // 1) Download the raw video from S3 into /tmp
  await downloadS3(BUCKET, key, inPath);

  // 2) Run FFmpeg to compress/transcode
  await runFFmpeg([
    "-i", inPath,
    "-vcodec", "libx264",
    "-preset", "veryfast",
    "-crf", CRF,
    "-vf", "scale='-2:min(720,ih)'",
    "-acodec", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    outPath
  ]);

  // 3) Upload the processed video back to S3
  const outKey = `${OUTPUT_PREFIX}${baseName}`;
  await uploadS3(BUCKET, outKey, outPath, "video/mp4");

  // 4) Cleanup temporary files
  try {
    fs.unlinkSync(inPath);
    fs.unlinkSync(outPath);
  } catch {}

  // Return metadata (for logging or debugging)
  return { ok: true, outKey };
};

// Helper: download object from S3 and save to disk
async function downloadS3(Bucket, Key, toPath) {
  const res = await s3.send(new GetObjectCommand({ Bucket, Key }));
  await streamToFile(res.Body, toPath);
}

// Helper: upload file back to S3
async function uploadS3(Bucket, Key, filePath, ContentType) {
  const Body = fs.readFileSync(filePath);
  await s3.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
}

// Stream a readable stream (S3 object) into a local file
function streamToFile(stream, filePath) {
  return new Promise((resolve, reject) => {
    const w = fs.createWriteStream(filePath);
    stream.pipe(w);
    w.on("finish", resolve);
    w.on("error", reject);
  });
}

// Run FFmpeg as a child process
function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", args);
    p.stdout?.on("data", d => console.log(d.toString()));   // forward FFmpeg logs
    p.stderr?.on("data", d => console.error(d.toString()));
    p.on("close", code =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))
    );
  });
}