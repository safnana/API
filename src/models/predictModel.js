const tf = require("@tensorflow/tfjs-node");
const bucketName = "mlgcbucket";
const modelFileName = "model.json";
const modelURL = `https://storage.googleapis.com/mlgcbucket/submissions-model/model.json`;

let model;

const loadModel = async () => {
  if (!model) {
    try {
      console.log("Loading model from public URL...");
      model = await tf.loadGraphModel(modelURL);
      console.log("Model loaded successfully!");
    } catch (error) {
      console.error("Error loading model:", error);
      throw new Error("Failed to load model from URL");
    }
  }
  return model;
};

const processImage = (imageBuffer) => {
  const imageTensor = tf.node.decodeImage(imageBuffer);
  return imageTensor
    .resizeBilinear([224, 224])
    .expandDims(0)
    .toFloat()
    .div(tf.scalar(255.0));
};

module.exports = { loadModel, processImage };
