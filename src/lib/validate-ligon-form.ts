function isValidEmail(email: string) {
    const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  export default function validateLoginFormData(loginForm:any){
    const {email, password} = loginForm;
    if(!isValidEmail(email)){
        
    }
  }