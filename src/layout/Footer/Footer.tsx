import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="flex w-full translate-y-[10vh] flex-col bg-[#edc7f5]">
            <div className="flex flex-row items-center justify-center">
                <a
                    className="m-2"
                    href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mimmi Flowers on Instagram"
                >
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                    className="m-2"
                    href="https://www.tiktok.com/@mimmi_flowers"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mimmi Flowers on TikTok"
                >
                    <FontAwesomeIcon icon={faTiktok} />
                </a>
            </div>
            <p className="Footer-Section__Copyright">&copy; Igor Puris</p>
        </footer>
    );
};

export default Footer;
