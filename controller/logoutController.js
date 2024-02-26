const User = require('../models/User')

const handleLogout = async (req, res) => {
    //need also to delete in client
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    //Check if refreshToken in db
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        return res.sendStatus(204)
    }
    //Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken)
    const result = await foundUser.save()
    
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.sendStatus(204)
}

module.exports = { handleLogout }