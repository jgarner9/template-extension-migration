const generateUID = () => {
  //generate UID based on current date and a random number
  return Date.now().toString(36) + Math.random().toString(36)
}

export { generateUID }
