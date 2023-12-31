import { useNavigate } from "react-router"
import ChangeReceiptIcon from "../../image/ChangeReceiptIcon"
import LockIcon from "../../image/LockIcon"
import PowerIcon from "../../image/PowerIcon"
import RegisterIcon from "../../image/RegisterIcon"
import WriteIcon from "../../image/WriteIcon"
import { useRecoilState } from "recoil"
import { AtomIsLogin, AtomIsMobile, AtomWidth } from "./../common/Common"
import { useEffect, useState } from "react"
import ArrowLeftIcon from "../../image/ArrowLeftIcon"
import ArrowRightIcon from "../../image/ArrowRightIcon"
import SupervisorIcon from "../../image/SupervisorIcon"
import MessageIcon from "../../image/MessageIcon"

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(AtomIsLogin);
  const [isExpanded, setIsExpanded] = useState(true);
  // eslint-disable-next-line
  const [innerWidth, setInnerWidth] = useRecoilState(AtomWidth);
  // eslint-disable-next-line
  const [isMobile, setIsMobile] = useRecoilState(AtomIsMobile);
  const [headerHeight, setHeaderHeight] = useState(window.screen.availHeight);
  const [headerWidth, setHeaderWidth] = useState(18+'rem');

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  }

  const handleInnerWidth = () => {
    setInnerWidth(window.innerWidth);
  }

  useEffect(()=>{
    handleInnerWidth();
    window.addEventListener('resize',handleInnerWidth);
    return ()=> {
      window.removeEventListener('resize',handleInnerWidth);
    }
    // eslint-disable-next-line
  },[])

  useEffect(()=>{
    if(innerWidth < 768) setIsMobile(true);
    else setIsMobile(false);
    // eslint-disable-next-line
  },[innerWidth])

  const handleResize = () => {
    setHeaderHeight(Math.max(
      document.body.scrollHeight, document.body.offsetHeight,
      document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight
    ));
  };

  const handleScroll = () => {
    setHeaderHeight(Math.max(
      document.body.scrollHeight, document.body.offsetHeight,
      document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight
    ));
  };

  useEffect(()=>{
    const token = sessionStorage.getItem("token");
    if(token) setIsLoggedIn(true);
    if(innerWidth < 768) {
      setTimeout(()=>{setIsExpanded(false);},500); 
    }
 
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    handleInnerWidth();

    const main = document.querySelector("main");
    main.addEventListener('click',()=>{
        setIsExpanded(false);
    })
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line
  },[])


  useEffect(() => {
    if(isExpanded)
      setHeaderWidth(18 + "rem")
    else
      setTimeout(()=>{
        setHeaderWidth( 0);
      },500)
  },[isExpanded]);

  useEffect(()=>{
    const url = new URL(window.location.href);
    const menuItem = document.querySelectorAll("#menuItem");
    switch(url.pathname){
      case menuItems[0]["items"][0]["url"] :
        menuItem.forEach(item => item.classList.remove("underline"));
        menuItem[0].classList.add("underline"); 
        break;
      case menuItems[0]["items"][1]["url"] : 
        menuItem.forEach(item => item.classList.remove("underline"));
        menuItem[1].classList.add("underline"); 
        break;
      case ( menuItems[1] ? menuItems[1]["items"][0]["url"] : "/Im_not_url"): 
        menuItem.forEach(item => item.classList.remove("underline"));
        menuItem[2].classList.add("underline"); 
        break;
      case ( menuItems[1] && menuItems[1]["items"][1] ? menuItems[1]["items"][1]["url"] : "/Im_not_url"): 
        menuItem.forEach(item => item.classList.remove("underline"));
        menuItem[3].classList.add("underline"); 
        break;
      case ( menuItems[2] ? menuItems[2]["items"][0]["url"] : "/Im_not_url") :
        menuItem.forEach(item => item.classList.remove("underline"));
        if(menuItem[4]) menuItem[4].classList.add("underline");
        else menuItem[3].classList.add("underline"); 
        break;
      default :
        menuItem.forEach(item => item.classList.remove("underline"));
        break;
    }
    // eslint-disable-next-line
  },[navigate])

  const sidebarClass = isExpanded ? "translate-x-0" : `-translate-x-[18rem]`;
  const arrowIcon = isExpanded ? <ArrowLeftIcon /> : <ArrowRightIcon />

  const menuItems = [
      {
          title: "영수증 관리",
          items: [
            { name: "수기 영수증 변환", icon: <ChangeReceiptIcon />, url : "/transform_receipt" },
            { name: "영수증 관리", icon: <WriteIcon />, url : "/manage_receipt" }
          ]
      },
      {
        title: "회사 관리",
        items: [
          ...(isLoggedIn&(sessionStorage.getItem("role") === "[ROLE_ADMIN]") ?
          [
          { name: "소속 회원 관리", icon : <SupervisorIcon/>, url : "/company/manage_member" },
          { name: "메신저", icon : <MessageIcon/>, url : "/company/message/lobby"}
          ]
          :
          [{ name: "메신저", icon : <MessageIcon/>, url : "/company/message/lobby"}]
          )
        ] 
      },
      {
          title: "내 정보 관리",
          items: [
              ...(!isLoggedIn ? 
              [{ name: "회원가입", icon: <RegisterIcon />, url : "/signup" }] 
              : 
              [{ name: "비밀번호 변경", icon: <LockIcon />, url : "/mypage/change_password" }]
              )
          ]
      }
  ]

  const handleLoginButton = () => {
      navigate("/login")
  }

  const handleLogoutButton = () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("association");
      setIsLoggedIn(false);
      navigate("/login");
  }

  const handleNavigate = (e,url) => {
      navigate(url);
  }

  return (
      <>
        <header style={{ width : headerWidth, height: headerHeight }} id="header" className={`fixed z-[9999]`}>
          <div
          className={`relative w-full h-full bg-custom-blue transition-all duration-500 ease-in-out ${sidebarClass}`}>
            <div className="w-full h-[6rem] border-b-[1px] border-gray-400">
              <h1 
              onClick={(e)=>{handleNavigate(e,"/")}} 
              className="pt-3 pl-4 h-[50%] w-full text-white text-lg font-bold hover:cursor-pointer hover:opacity-70">
                  YOUNGMAN PROJECT
              </h1>
              <div className="h-[27%] w-full flex mt-2">
                <button onClick={isLoggedIn ? handleLogoutButton : handleLoginButton} className="w-[50%] flex pl-6">
                  <PowerIcon />
                  <div className=" text-white text-base pl-1 pt-[1px] hover:opacity-70">
                    {isLoggedIn ? "로그아웃" : "로그인"}
                  </div>
                </button>
                <div className="w-[73%] text-[#bdb3b3] text-[14px] flex justify-center items-center mt-1 pr-2" >
                  {isLoggedIn ? (
                  <span className="text-center">{sessionStorage.getItem("username")}님 환영합니다</span>
                    ) : (
                    '로그인이 필요합니다'
                  )}
                </div>
              </div>
            </div>
              {/* 메뉴 아이템 */}
            <div className="w-full">
              {menuItems.map((menu, menuIndex) => {
                // eslint-disable-next-line
                if(!menu) return;
                else
                return(
                <div className="text-white ml-4 mt-4 m-20" key={`key${menuIndex}`}>
                  <h2 className="text-base font-bold p-1">{menu.title}</h2>
                    <nav>
                      {
                        menu.items ?
                        menu.items.map((item, itemIndex) => {
                        return (
                          <div id="menuItem" className="flex w-full p-2 hover:cursor-pointer hover:opacity-70" key={`key${itemIndex}`} onClick={(e)=>{handleNavigate(e,item.url)}}>
                            {item.icon}
                            <span className="px-2 mt-1">{item.name}</span>
                          </div>
                        )})
                        :
                        ""
                      }
                    </nav>
                  </div>
                  )})}
              </div>
          </div>
          {/* 화살표 버튼 */}
          </header>
          <button onClick={toggleSidebar}
          className={`shadow-lg border-2 border-l-0 w-10 h-10 border-gray-400 left-[18rem] bg-[#707070] z-[9999] fixed top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${sidebarClass}`}>
            {arrowIcon}
          </button>
      </>
    )
}

export default Header
