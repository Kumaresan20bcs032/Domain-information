const dns = require("node:dns").promises;
const { errorResponse, successResponse } = require("../utils/responseHandler");

/**
 * @description To check the DNS record of a host (A, AAAA, CNAME, etc.)
 * @route       GET /dns-lookup?host=example.com&type=A
 * @access      Nill
 */
class DnsLookUp {
    async lookup(req, res) {
        try {

            // Destructure the incoming query.
            let { host = "" } = req.query;

            // If the host is not provided then return error.
            if (!host) {
                return errorResponse(res, 400, "Please provide a host.");
            }

            // Remove protocol if user provides full URL
            host = host.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");

            const types = ["A", "AAAA", "ANY", "CAA", "CNAME", "MX", "NAPTR", "NS", "PTR", "SOA", "SRV", "TLSA", "TXT"];
            const result = {};

            // Loop through and find the records of the domain
            for (const type of types) {
                try {
                    const records = await dns.resolve(host, type);
                    result[type] = records;
                }
                catch (err) {
                    result[type] = `No records or error: ${err.code || err.message}`;
                }
            }

            return successResponse(res, 200, "DNS records fetched successfully.", result);

        } catch (error) {
            console.error("Error in DNS lookup:", error);
            return errorResponse(res, 500, error?.message || "Internal server error.");
        }
    }
}

module.exports = new DnsLookUp();
