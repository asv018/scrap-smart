function isValidIndianPincode(pincode: string) {
  let pincodePattern = /^\d{6}$/;
  return pincodePattern.test(pincode);
}
export default function validateComplainFormData(form: any) {
  const {
    firstName,
    lastName,
    city,
    email,
    streetAddress,
    state,
    pincode,
    images,
  } = form;
  if (!firstName.length) {
    return { success: false, message: "Please enter first name" };
  } else if (!lastName.length) {
    return { success: false, message: "Please enter last name" };
  } else if (!city.length) {
    return { success: false, message: "Please enter city" };
  } else if (!streetAddress.length) {
    return { success: false, message: "Please enter street address" };
  } else if (!state.length) {
    return { success: false, message: "Please enter state name" };
  } else if (!isValidIndianPincode(pincode)) {
    return { success: false, message: "Please enter valid pincode" };
  } else if (images.length < 1) {
    return { success: false, message: "Please enter at least 1 images" };
  }
  return { success: true, message: "Validate form data" };
}
