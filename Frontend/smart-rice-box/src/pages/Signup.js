import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import "../css/main.css"
import "../css/util.css"

export default function SignUp() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()

  const handleSignUp = async (event) => {
    event.preventDefault()
    // Add your sign-up logic here
    console.log('Signing up:', phone, password, confirmPassword);
    if (!phone){
        alert("Vui lòng nhập số điện thoại")
        return
    }
    if (!password){
        alert("Vui lòng nhập mật khẩu")
        return
    }
    if (!confirmPassword){
        alert("Vui long nhập mật khẩu xác nhận")
        return
    }
    if (password !== confirmPassword){
        alert("Mật khẩu và mật khẩu xác nhận phải giống nhau")
        return
    }
    var response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        {
            method:"POST",
            body:JSON.stringify({
                "phone_num" : phone,
                "password": password,
                "repeat_password": confirmPassword,
                "role": "seller"
            }),
            headers:{
                "Content-Type": "application/json"
            }
        }
    )
    var responseJson = await response.json()
    if (response.ok){
        console.log(responseJson)
        navigate("/login");
    }
    else{
        alert("Số điện thoại đã tồn tại")
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form className="login100-form validate-form">
            <span className="login100-form-title p-b-26">Sign Up</span>
            <div className="d-flex justify-content-center mb-3" style={{
                            justifyContent:"center",
                            alignItems:"center",
                            display:"flex",
                        }}>
                            <img src={require('../images/logo.png')} alt="Logo" />
            </div>
            <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
              <input
                className="input100"
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <span className="focus-input100" data-placeholder="Phone Number"></span>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Enter password">
              <span className="btn-show-pass">
                <i className="zmdi zmdi-eye"></i>
              </span>
              <input
                className="input100"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input100" data-placeholder="Password"></span>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Confirm password">
              <span className="btn-show-pass">
                <i className="zmdi zmdi-eye"></i>
              </span>
              <input
                className="input100"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="focus-input100" data-placeholder="Confirm Password"></span>
            </div>

            <div className="container-login100-form-btn">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn" ></div>
                <button className="login100-form-btn btn-login" onClick={handleSignUp}>
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
