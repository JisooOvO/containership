import { useNavigate } from "react-router-dom"

const Navigation = ({title, url}) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(url);
  }

  return (
    <div onClick={handleNavigate} className="hover:cursor-pointer sm:text-base text-[80%] text-white hover:text-gray-300 drop-shadow-md flex justify-center items-center">
      {title}
    </div>
  )
}

export default Navigation
