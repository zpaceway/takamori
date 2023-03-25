import { type Gameboy } from "gameboy-emulator";
import { useEffect, useRef, useState } from "react";

const fileToArrayBuffer = (
  file: File
): Promise<null | string | ArrayBuffer> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result);

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error("Error parsing file"));
    };

    fileReader.readAsArrayBuffer(file);
  });
};

function Home() {
  const romFileRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [useWith, setUseWidth] = useState(false);
  const [useHeight, setUseHeight] = useState(false);

  const [gameboyInstance, setGameboyInstance] = useState<Gameboy>();

  useEffect(() => {
    if (!canvasRef.current || !screenRef.current) return;
  }, []);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { Gameboy } = await import("gameboy-emulator");
    if (
      event.target.files &&
      event.target.files[0] &&
      canvasRef.current &&
      screenRef.current
    ) {
      const rom = (await fileToArrayBuffer(
        event.target.files[0]
      )) as ArrayBuffer;
      const gameboy = new Gameboy();

      setGameboyInstance(gameboy);

      gameboy.loadGame(rom);
      gameboy.apu.enableSound();

      const context = canvasRef.current.getContext("2d");

      if (!context) return;

      canvasRef.current.style.width = screenRef.current.offsetWidth + "px";
      canvasRef.current.style.height = screenRef.current.offsetHeight + "px";
      canvasRef.current.width = screenRef.current.offsetWidth;
      canvasRef.current.height = screenRef.current.offsetHeight;

      context.createImageData(
        canvasRef.current.width,
        canvasRef.current.height
      );

      context.imageSmoothingEnabled = false;

      gameboy.onFrameFinished((imageData: ImageData) => {
        context && context.putImageData(imageData, 0, 0);
        setUseHeight(false);
        setUseHeight(true);
        setUseWidth(false);
        setUseWidth(true);
      });

      gameboy.run();
    }
  };

  return (
    <div className="app">
      <input
        type="file"
        style={{ display: "none" }}
        ref={romFileRef}
        onChange={onFileChange}
      />
      <div className="tamarori">
        <div className="inner">
          <div className="inner__top">
            <div className="protector">
              <div
                ref={screenRef}
                className="screen"
                style={{ position: "relative" }}
              >
                <canvas
                  className="screen"
                  width={useWith ? 160 : undefined}
                  height={useHeight ? 144 : undefined}
                  ref={canvasRef}
                ></canvas>
              </div>
            </div>
            <div className="logo-container">
              <span className="logo">ZPACEWAY</span>
              <span>®</span>
            </div>
          </div>
          <div className="inner__bottom">
            <div className="top-buttons">
              <div className="pad">
                <div className="pad__horizontal">
                  <div
                    className="left"
                    onMouseDown={() => {
                      gameboyInstance!.input.isPressingLeft = true;
                    }}
                    onMouseUp={() => {
                      gameboyInstance!.input.isPressingLeft = false;
                    }}
                    onTouchStart={() => {
                      gameboyInstance!.input.isPressingLeft = true;
                    }}
                    onTouchEnd={() => {
                      gameboyInstance!.input.isPressingLeft = false;
                    }}
                  ></div>
                  <div
                    className="right"
                    onMouseDown={() => {
                      gameboyInstance!.input.isPressingRight = true;
                    }}
                    onMouseUp={() => {
                      gameboyInstance!.input.isPressingRight = false;
                    }}
                    onTouchStart={() => {
                      gameboyInstance!.input.isPressingRight = true;
                    }}
                    onTouchEnd={() => {
                      gameboyInstance!.input.isPressingRight = false;
                    }}
                  ></div>
                </div>
                <div className="pad__vertical">
                  <div
                    className="up"
                    onMouseDown={() => {
                      gameboyInstance!.input.isPressingUp = true;
                    }}
                    onMouseUp={() => {
                      gameboyInstance!.input.isPressingUp = false;
                    }}
                    onTouchStart={() => {
                      gameboyInstance!.input.isPressingUp = true;
                    }}
                    onTouchEnd={() => {
                      gameboyInstance!.input.isPressingUp = false;
                    }}
                  ></div>
                  <div
                    className="down"
                    onMouseDown={() => {
                      gameboyInstance!.input.isPressingDown = true;
                    }}
                    onMouseUp={() => {
                      gameboyInstance!.input.isPressingDown = false;
                    }}
                    onTouchStart={() => {
                      gameboyInstance!.input.isPressingDown = true;
                    }}
                    onTouchEnd={() => {
                      gameboyInstance!.input.isPressingDown = false;
                    }}
                  ></div>
                </div>
              </div>
              <div className="buttons">
                <div
                  className="button-a"
                  onMouseDown={() => {
                    gameboyInstance!.input.isPressingA = true;
                  }}
                  onMouseUp={() => {
                    gameboyInstance!.input.isPressingA = false;
                  }}
                  onTouchStart={() => {
                    gameboyInstance!.input.isPressingA = true;
                  }}
                  onTouchEnd={() => {
                    gameboyInstance!.input.isPressingA = false;
                  }}
                >
                  A
                </div>
                <div
                  className="button-b"
                  onMouseDown={() => {
                    gameboyInstance!.input.isPressingB = true;
                  }}
                  onMouseUp={() => {
                    gameboyInstance!.input.isPressingB = false;
                  }}
                  onTouchStart={() => {
                    gameboyInstance!.input.isPressingB = true;
                  }}
                  onTouchEnd={() => {
                    gameboyInstance!.input.isPressingB = false;
                  }}
                >
                  B
                </div>
              </div>
            </div>
            <div className="bottom-buttons">
              <div
                className="button"
                onMouseDown={() => {
                  gameboyInstance!.input.isPressingSelect = true;
                }}
                onMouseUp={() => {
                  gameboyInstance!.input.isPressingSelect = false;
                }}
                onTouchStart={() => {
                  gameboyInstance!.input.isPressingSelect = true;
                }}
                onTouchEnd={() => {
                  gameboyInstance!.input.isPressingSelect = false;
                }}
              >
                SELECT
              </div>
              <div
                className="button"
                onClick={() => romFileRef.current?.click()}
              >
                LOAD
              </div>
              <div
                className="button"
                onMouseDown={() => {
                  gameboyInstance!.input.isPressingStart = true;
                }}
                onMouseUp={() => {
                  gameboyInstance!.input.isPressingStart = false;
                }}
                onTouchStart={() => {
                  gameboyInstance!.input.isPressingStart = true;
                }}
                onTouchEnd={() => {
                  gameboyInstance!.input.isPressingStart = false;
                }}
              >
                START
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
