function isValidEmail(email: string) {
  const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
function isValidPhoneNumber(phoneNumber: string) {
  const regex = /^[789]\d{9}$/;
  return regex.test(phoneNumber);
}
export default function validateSignUpFormData(formData: any) {
  const { email, password, name, phone } = formData;
  if (!isValidEmail(email)) {
    return { success: false, message: "Invalid email" };
  } else if (password.length < 6) {
    return { success: false, message: "Password length minimum 6" };
  } else if (!isValidPhoneNumber(phone)) {
    return { success: false, message: "Invalid phone no" };
  } else if (name.length < 5) {
    return { success: false, message: "Name length minimum 5" };
  }
  return { success: true, message: "Form data validate" };
}
