const { loadModel, processImage } = require("../models/predictModel");
const admin = require("firebase-admin");
const uuid = require("uuid");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),  
});
const db = admin.firestore();

const predict = async (req, res) => {
  try {
    const model = await loadModel();

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No image file provided",
      });
    }

    const tensor = processImage(req.file.buffer);
    const prediction = model.predict(tensor).dataSync()[0];
    const result = prediction > 0.5782315135002136 ? "Cancer" : "Non-cancer";
    const suggestion =
      result === "Cancer"
        ? "Segera periksa ke dokter!"
        : "Penyakit kanker tidak terdeteksi.";
    const predictionId = uuid.v4();
    const createdAt = new Date().toISOString();

    await db.collection("predictions").doc(predictionId).set({
      id: predictionId,
      result,
      suggestion,
      createdAt,
    });

    res.json({
      status: "success",
      message: "Model is predicted successfully",
      data: {
        id: predictionId,
        result,
        suggestion,
        createdAt,
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const snapshot = await db.collection("predictions").get();
    const histories = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: doc.data(),
    }));

    res.json({
      status: "success",
      data: histories,
    });
  } catch (error) {
    console.error("Error fetching histories:", error);
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil riwayat prediksi",
    });
  }
};

module.exports = { predict, getHistory };
