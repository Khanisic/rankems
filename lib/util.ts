export function generateCode() {
    let code = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // You can include lowercase if you want

    for (let i = 0; i < 3; i++) { // Loop runs 3 times because we want 3 numbers and 3 characters
        const randomNum = Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
        const randomChar = characters.charAt(Math.floor(Math.random() * characters.length)); // Picks a random character
        code += randomNum.toString() + randomChar; // Appends number then character
    }

    return code;
}