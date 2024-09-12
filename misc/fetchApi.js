const fetchWithTimeOut = async (resource, options = { } ) => {
    const { timeout = 3000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout );
    const response = await fetch(`${process.env.API_URI}\\${resource}`, {
       ...options,
        headers: {
            "Content-Type": "application/json"
        },
       signal: controller.signal
    });

    clearTimeout(id);

    return response;
};

module.exports = { fetchWithTimeOut };