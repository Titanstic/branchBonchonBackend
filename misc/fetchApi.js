const fetchWithTimeOut = async (resource, options = { } ) => {
    const { timeout = 3000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout );
    const response = await fetch(`http://43.231.65.130:3001/${resource}`, {
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