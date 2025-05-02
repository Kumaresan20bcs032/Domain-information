const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes/index")
const { successResponse } = require("./utils/responseHandler");
const app = express();


app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
    return successResponse(res, 200, "Application api working.");
})

app.use("/api/v1", router);

app.use(/(.*)/, (req, res) => {
    return errorResponse(res, 400, "Request route not found.");
});

const PORT = process.env?.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server started at host http://localhost:${PORT}`);
})