

const signUpController = async (req, res) => {
    try {
        await res.send("sign Up")
    } catch (error) {
        console.log(error);
           
    }
}

const loginController = async (req, res) => {
    try {
        await res.send("login ")
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    signUpController,
    loginController
}