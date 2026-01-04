import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

interface LoadingPageProps {
  state: "open" | "close" | "idle"; // open = buka, close = tutup, idle = normal diam
}

const LoadingPage: React.FC<LoadingPageProps> = ({ state }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [isWhite, setIsWhite] = useState(false);

  useEffect(() => {
    if (state === "close") {
      // Sembunyikan loader sementara panel menutup
      setShowLoader(false);
      const timer = setTimeout(() => {
        setShowLoader(true);
        setIsWhite(true); // Setelah panel ketemu → loader putih
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state === "open") {
      setShowLoader(true);
      setIsWhite(false); // Loader biru saat panel terbuka
    } else if (state === "idle") {
      setShowLoader(true);
      setIsWhite(false); // Loader biru normal
    }
  }, [state]);

  return (
    <Container>
      {/* Loader di tengah */}
      {showLoader && (
        <CenterContent>
          <StyledWrapper $isWhite={isWhite}>
            <div className="loader" />
          </StyledWrapper>
        </CenterContent>
      )}

      {/* Panel kiri & kanan hanya muncul jika bukan idle */}
      {state !== "idle" && (
        <>
          <LeftPanel $state={state} />
          <RightPanel $state={state} />
        </>
      )}
    </Container>
  );
};

// ===================== ANIMASI PANEL =====================
const openLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;
const openRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;
const closeLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;
const closeRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

// ===================== LAYOUT =====================
const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: #111827;
  }
`;

const CenterContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const PanelBase = styled.div<{ $state: "open" | "close" | "idle" }>`
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  background: #1e3a8a;
  z-index: 5;
`;

const LeftPanel = styled(PanelBase)`
  left: 0;
  ${({ $state }) =>
    $state === "open"
      ? css`
          animation: ${openLeft} 1s ease-in-out forwards;
        `
      : $state === "close"
        ? css`
          animation: ${closeLeft} 1s ease-in-out forwards;
        `
        : ""}
`;

const RightPanel = styled(PanelBase)`
  right: 0;
  ${({ $state }) =>
    $state === "open"
      ? css`
          animation: ${openRight} 1s ease-in-out forwards;
        `
      : $state === "close"
        ? css`
          animation: ${closeRight} 1s ease-in-out forwards;
        `
        : ""}
`;

// ===================== LOADER =====================
const StyledWrapper = styled.div<{ $isWhite: boolean }>`
  .loader {
    height: 15px;
    aspect-ratio: 4;
    --color: ${({ $isWhite }) => ($isWhite ? "#ffffff" : "#1e3a8a")};
    --_g: no-repeat radial-gradient(farthest-side, var(--color) 90%, var(--color));
    background:
      var(--_g) left,
      var(--_g) right;
    background-size: 25% 100%;
    display: grid;
  }

  .loader:before,
  .loader:after {
    content: "";
    height: inherit;
    aspect-ratio: 1;
    grid-area: 1/1;
    margin: auto;
    border-radius: 50%;
    transform-origin: -100% 50%;
    background: #ffbc04;
    animation: l49 1s infinite linear;
  }

  .loader:after {
    transform-origin: 200% 50%;
    --s: -1;
    animation-delay: -0.5s;
  }

  @keyframes l49 {
    58%,
    100% {
      transform: rotate(calc(var(--s, 1) * 1turn));
    }
  }
`;

export default LoadingPage;
