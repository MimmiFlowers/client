import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="w-full bg-[#edc7f5] flex flex-col translate-y-[10vh]">
      <div className="flex flex-row items-center justify-center">
        <a
          className="m-2"
          href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ=="
          target="_blank"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          className="m-2"
          href="https://www.tiktok.com/@mimmi_flowers"
          target="_blank"
        >
          <FontAwesomeIcon icon={faTiktok} />
        </a>
        {/* <a className="icons__item" href="https://t.me/Let_your_mind_go" target="_blank"><FontAwesomeIcon icon={faTelegramPlane}/></a> */}
      </div>
      <p className="Footer-Section__Copyright">&copy; Igor Puris</p>
    </div>
  );
};

export default Footer;
