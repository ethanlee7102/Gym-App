const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");