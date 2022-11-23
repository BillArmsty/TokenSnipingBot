const axios = require('axios');
const address = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
const rugAddress = "0xCa3a4CB38DEFfD0Be07769e752f857683D24761b"
const rugCheck = async (address: string) => {
    try {
        const {data} = await axios.get(`https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot?chain=eth&token=${address}`)
       console.log(data)
        if (data.IsHoneypot === false) {
             console.log("Hii token ni fiti")
        } else {
            console.log("Ni fake")
        }
    } catch (error) {
        console.log(error)
    }
}
export const Check = async () => {
    await rugCheck(rugAddress)
}