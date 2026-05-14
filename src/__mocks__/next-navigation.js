const redirect = (url) => {
  throw new Error(url);
};
const notFound = () => {
  throw new Error("NEXT_NOT_FOUND");
};
const useRouter = () => ({ push: jest.fn(), replace: jest.fn() });

module.exports = { redirect, notFound, useRouter };
