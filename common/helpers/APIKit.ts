import client from "./HTTPKit";

const APIKit = {
  public: {
    getCourse: () => {
      const url = `/products/ielts-course`;
      return client.get(url);
    },
  },
};

export default APIKit;
