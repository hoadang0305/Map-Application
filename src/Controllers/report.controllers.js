const reportService = require("../Services/report.services");
const reportImgService = require("../Services/reportImg.services");
const reportImg = require('../Models/Image.js');

const createReport = async (req, res) => {
    try {
        //lưu ảnh lên mongoo
        const files = req.files.map(file => {
            return {
                data: file.buffer,
                contentType: file.mimetype,
            }
        })
        const savedFile = (await reportImgService.sendReportImg(files)).data;

        const panelId = req.params.id;
        if (!panelId) {
            return res.status(404).json({
                status: "ERR",
                message: "The panelId is required",
            });
        }
        const locate = [req.query.lng, req.query.lat];
        if (!locate) {
            return res.status(404).json({
                status: "ERR",
                message: "The locate is required",
            });
        }
        const district = req.query.district
        const ward = req.query.ward
        const address = req.query.address
        const { reportType, name, email, phone, content } = req.body
        if (!reportType || !name || !email || !phone || !content || !district || !ward || !address) {
            return res.status(404).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const imgId = savedFile.map(file => file._id);
        const report = await reportService.createReport(panelId, locate, req.body, imgId, district, ward, address);
        res.status(200).json(report.data);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const getAllReport = async (req, res) => {
    try {
        const report = await reportService.getAllReport();
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const showReport = async (req, res) => {
    res.render("report", { address: req.query.address });
};

module.exports = {
    createReport,
    getAllReport,
    showReport,
};
