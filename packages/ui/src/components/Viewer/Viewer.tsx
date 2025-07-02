

// !!!!! ADD PROP TYPES !!!!!

import { useEffect } from "react";
import { useViewerState } from "./ViewerProvider"

export default function Viewer({ data, onViewer, onData, onDblClick }) {
  
  const [message, setMessage] = useState("Loading structure ...");

  // create viewer
  useEffect(() => {
    if (!data) {
      setMessage('No data');
      return;
    }

    // create viewer
    const _viewer = createViewer(viewerRef.current.querySelector(".viewerContainer"), {
      backgroundColor: "#f8f8f8",
      antialias: true,
      cartoonQuality: 10,
    });
    _viewer.getCanvas().addEventListener(
      "wheel",
      event => {
        if (!event.ctrlKey) event.stopImmediatePropagation();
      },
      true // use capture phase so fires before library handler
    );
    if (onDblClick) {
      _viewer.getCanvas().ondblclick = event => {
        onDblClick(event, _viewer, data, setMessage); 
      }
    }
    onViewer?.(_viewer, setMessage);

    // load viewer
    const models = data.map({ structureData } => _viewer.addModel(structureData, "cif"));
    onData?.(_viewer, data, setMessage);

    !!! HERE !!!!!!!!!!!!!!!!!!!!!!!!


        _viewer?.setStyle({}, { hidden: true });
       

        setHoverBehavior({
          viewer: _viewer,
          variantResidues,
          setHoveredAtom,
          colorBy,
        });
        _viewer.render();
        setMessage("");
        setViewer(_viewer);
      }
    }

    return () => {
      setHoveredAtom(null);
      _viewer?.clear();
    };
  }, []);


  - ADD USEEFFECT TO UPDATE BASED ON STATE - AS WELL AS 
    STATE VARIABLE(S) TO STORE OLD VALUES OF STATE.

  - ADD HTML FROM OTHER VIEWERS