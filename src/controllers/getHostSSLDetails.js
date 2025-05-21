const tls = require("node:tls");
const { errorResponse, successResponse } = require("../utils/responseHandler");

/**
 * @description To get the ssl certificate record of given host.
 * @route       GET /host-ssl-information?host=example.com
 * @access      Nill
 */
class GetHostSSLCertificate {
    async details(req, res) {
        try {

            let { host = "" } = req.query;

            if (!host) {
                return errorResponse(res, 400, "Please provide a host.");
            }

            host = host.replace(/^https?:\/\//, "").replace(/\/$/, "");

            const options = {
                host,
                port: 443,
                servername: host,
            };

            // Since tls is supported callback option only try to use promise method to solve the problem.
            const certData = await new Promise((resolve, reject) => {
                // Use tls connect to get the sll information.
                const socket = tls.connect(options, () => {

                    const cert = socket.getPeerCertificate();

                    // Build result object
                    const result = {
                        subject: cert?.subject?.CN ?? "No subject found.",
                        issuer: cert?.issuer.C ?? "No issuer found.",
                        subjectaltName: cert.subjectaltname?.split(",") ?? ["No subject altName found."],
                        infoAccess: cert?.infoAccess ?? {},
                        ca: cert?.ca ?? false,
                        bits: cert?.bits ?? 0,
                        exponent: cert?.exponent ?? "No exponent found.",
                        validFrom: cert?.valid_from ?? "No validFrom found.",
                        validTo: cert?.valid_to ?? "No validTo found.",
                        fingerprint: cert?.fingerprint ?? "No fingerprint found.",
                        fingerprint256: cert?.fingerprint256 ?? "No fingerprint256 found.",
                        fingerprint512: cert?.fingerprint512 ?? "No fingerprint512 found.",
                        extKeyUsage: cert?.ext_key_usage ?? [],
                        serialNumber: cert?.serialNumber ?? "No serialNumber found.",
                    };

                    // End the socket connection.
                    socket.end();

                    resolve(result);
                });

                socket.on("error", (err) => {
                    reject(err);
                });
            });

            return successResponse(res, 200, "SSL certificate details fetched successfully.", certData);

        } catch (error) {
            console.error("Error fetching certificate:", error);
            return errorResponse(res, 500, error?.message || "Internal server error.");
        }
    }
}

module.exports = new GetHostSSLCertificate();
