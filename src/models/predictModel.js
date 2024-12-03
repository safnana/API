const tf = require("@tensorflow/tfjs-node");
const modelURL = `https://storage.googleapis.com/mlgcbucket/submissions-model/model.json`;

let model;

const loadModel = async () => {
  if (!model) {
    try {
      console.log("Loading model");
      model = await tf.loadGraphModel(modelURL);
      console.log("Model loaded success!");
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to load model");
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
