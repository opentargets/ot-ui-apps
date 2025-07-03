

// !!!!! ADD PROP TYPES !!!!!

import { useEffect, useRef   } from "react";
import { useViewerState } from "./ViewerProvider";

const hoverDuration = 50;

export default function Viewer({ data, onData, onDblClick, appearance = [], initialMessage = "Loading structure ...", setZoomLimits }) {
  
  const [message, setMessage] = useState(initialMessage);
  const [viewer, setViewer] = useState(null);
  const viewerState = useViewerState();


!!!!! NOW: UPDATE BELOW TO MATCH CHANGES TO APPEARANCE OBJECT !!!!!

  const simpleAppearance = [];
  const depAppearance = [];
  const hoverAppearance = [];
  const clickAppearance = [];
  for (const a of appearance) {
    if (a.onHover) hoverAppearance.push(a);
    else if (a.onClick) clickAppearance.push(a);
    else if (a.dep) depAppearance.push(a);
    else simpleAppearance.push(a);
  }

  function applyAppearance({ selection, style, addStyle }) {
    if (typeof style === "function") style = style(viewerState);
    if (typeof selection === "function") selection = selection(viewerState);
    viewer[addStyle ? 'addStyle' : 'setStyle'](selection, style);
  }

  function addHoverAppearance(XXXX) {

  }

  function addClickAppearance(XXXX) {

  }

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
    _viewer.setHoverDuration(hoverDuration);
    setViewer(_viewer);

    // load data into viewer
    const models = data.map(({ structureData }) => _viewer.addModel(structureData, "cif"));
    onData?.(_viewer, data, setMessage);

    return () => _viewer.clear();

  }, []);

  // initialise/update viewer appearance based on state
  const prevValues = useRef({});
  useEffect(() => {
    if (!viewer) return;
    
    // hide everything
    _viewer?.setStyle({}, { hidden: true });

    // apply appearances with no dependencies
    for (const a of simpleAppearance) {
      a
    }
    const changed = new Set();
    for (const key of Object.keys(viewerState)) {
      viewerState[key] !== prevValues.current[key];
      changed.add(key);
    }
    for (const a of appearance) {
      if ()
    }


      if (newValue !== oldValue && effects[key]) {
        appearance[key](newValue);
      }
      prevValues.current[key] = newValue;
    }
  }, [viewer, viewerState, appearance]);


       

        setHoverBehavior({
          viewer: _viewer,
          variantResidues,
          setHoveredAtom,
          colorBy,
        });
        _viewer.render();
        setMessage("");

      }
    }



  - ADD HTML FROM OTHER VIEWERS