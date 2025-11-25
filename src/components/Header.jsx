import popcornImg from "../assets/popcorn-transparent.png"

export default function Header() {
    return (
      <header>
        <img 
          src={popcornImg} 
          alt="Cartoon popcorn with face" 
          className="app-logo"
        />
        <h1 className="app-title">Aronofsky Advisor</h1>
        <p className="sub-title">Discover the Darren Aronofsky movie for you!</p>
      </header>
    )
}