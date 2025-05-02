const tls = require("node:tls");
const { errorResponse, successResponse } = require("../utils/responseHandler");

/**
 * @description To get the ssl certificate details of provided host.
 * @route       GET /host-ssl-information?host=example.com
 * @access      Nill
 */
class GetHostSSLCertificate {
    async details(req, res) {
        try {

            // Destructure the incoming query.
            let { host = "" } = req.query;

            // If the host is not provided then return error.
            if (!host) {
                return errorResponse(res, 400, "Please provide a host.");
            }

            // Clean host (remove protocol)
            host = host.replace(/^https?:\/\//, "").replace(/\/$/, "");

            // create the options to getting ssl information.
            const options = {
                host,
                port: 443,
                servername: host
            }

            // connect with tls and get the sll certificate information.
            const socket = tls.connect(options, async () => {

                const cert = socket.getPeerCertificate()

                // build the result.
                const result = {
                    subject: cert?.subject?.CN ?? "No subject found.",
                    issuer: cert?.issuer.C ?? "No issuer found.",
                    subjectaltName: cert.subjectaltname ?? "No subject aly name found.",
                    infoAccess: cert?.infoAccess ?? {},
                    ca: cert?.ca ?? false,
                    bits: cert?.bits ?? 0,
                    exponent: cert?.exponent ?? "No exponent found.",
                    validFrom: cert?.valid_from ?? "Valid from not found.",
                    validTo: cert?.valid_to ?? "Valid to not found.",
                    fingerprint: cert?.fingerprint ?? "Fingetprint found.",
                    fingerprint256: cert?.fingerprint256 ?? "Fingerprint256 not found.",
                    fingerprint512: cert?.fingerprint512 ?? "Fingerprint512 not found.",
                    extKeyUsage: cert?.ext_key_usage ?? [],
                    serialNumber: cert?.serialNumber ?? "Seriel number not found."
                }

                //end the socket connection.
                socket.end();

                return successResponse(res, 200, "SSL certificate details fetched.", result)

            })

            socket.on('error', (err) => {
                console.error("TLS socket error:", err.message);
                return errorResponse(res, 500, `TLS connection failed: ${err.message}`);
            });


        } catch (error) {
            console.error("Error fetching certificate:", error);
            return errorResponse(res, 500, error?.message || "Internal server error.");
        }
    }
}

module.exports = new GetHostSSLCertificate();
