const axios = require('axios');
const imageType = require('image-type');

const gasyo = {
  is: {
    fetch: async (url) => {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      if (response.status !== 200) {
        return false;
      }

      return imageType(response.data);
    },
    jpg: async ({ url, type }) => {
      type = type || (await gasyo.is.fetch(url));
      return type.ext === 'jpg';
    },
    png: async ({ url, type }) => {
      type = type || (await gasyo.is.fetch(url));
      return type.ext === 'png';
    },
    bmp: async ({ url, type }) => {
      type = type || (await gasyo.is.fetch(url));
      return type.ext === 'bmp';
    },
    gif: async ({ url, type }) => {
      type = type || (await gasyo.is.fetch(url));
      return type.ext === 'gif';
    },
    webp: async ({ url, type }) => {
      type = type || (await gasyo.is.fetch(url));
      return type.ext === 'webp';
    },
    image: async (url) => {
      const type = await gasyo.is.fetch(url);
      return (
        (await gasyo.is.jpg({ type })) ||
        (await gasyo.is.png({ type })) ||
        (await gasyo.is.bmp({ type }))
      );
    },
  },
};

module.exports = gasyo;
