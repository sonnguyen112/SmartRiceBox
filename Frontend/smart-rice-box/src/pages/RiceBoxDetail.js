import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function RiceBoxDetail(){

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            // Your logic here
            window.location.href="/"
          };
      
          window.history.pushState(null, "", window.location.pathname);
          window.addEventListener('popstate', handleBackButton);
      
          return () => {
            window.removeEventListener('popstate', handleBackButton);
          };
    }, [])
    

    return(
        <div style={{
            display:"flex",
        }}>
            <iframe style={{
                width:"100%",
                height:"100vh"
            }} src={location.state.url_dashboard} id="dashboard" title="dashboard"></iframe>
        </div>
    )
}