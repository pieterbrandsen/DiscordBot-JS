module.exports = {
    execute(client, channelsArray, channelName) {
        let id;
        let i = 0;
        while(id == null && i < channelsArray.length) {
            const channel = channelsArray[i];
            if (channel.name.includes(channelName)) id = channel.id;
            i++;
        };

        if (id !== null)
        return client.channels.cache.get(id);
    }
}