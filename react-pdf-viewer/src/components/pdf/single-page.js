import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { StyleSheet } from "@react-pdf/renderer";
import { Spin, Progress } from "antd";
import { useWindowSize } from "hooks/useWindowSize";
import { useScroll } from "hooks/useScroll";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const isBrowser = typeof window !== `undefined`;

const styles = StyleSheet.create({
  page: { backgroundColor: "tomato", marginTop: "0px !important" },
  section: { color: "white", textAlign: "center", margin: 30 },
});
export default function SinglePage(props) {
  const [radio, setradio] = useState(0);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("active");
  const [paddingItem, setPaddingItem] = useState("0px");
  const scroll = useScroll();
  // const [numPages, setNumPages] = useState(1);
  // const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page
  const { width, height } = useWindowSize();

  //
  // function changePage(offset) {
  //   setPageNumber((prevPageNumber) => prevPageNumber + offset);
  // }
  //
  // function previousPage() {
  //   changePage(-1);
  // }
  //
  // function nextPage() {
  //   changePage(1);
  // }

  const {
    pdf,
    pageNumber,
    onDocumentLoadSuccess,
    numPages,
    setloading,
    loading,
    viewStyle,
  } = props;
  const getPadding = (width) => {
    if (width < 768) {
      var elmnt = document.getElementsByClassName("react-pdf__Page")[0];
      if (elmnt?.offsetHeight && elmnt?.offsetWidth) {
        // console.log(elmnt.offsetHeight);
        // console.log(elmnt["width"]);
        // console.log(elmnt["height"]);
        let radiopadding = elmnt.offsetHeight / elmnt.offsetWidth;
        let newheight = width * radiopadding;

        // let newheight = (width * 22) / 17;
        let padding = height - newheight;
        let newpadding = padding / 2 + "px";

        setPaddingItem(newpadding);
        return newpadding;
      }
    } else {
      return "0px";
    }
    // (width * 22) / 17 <= height
    //   ? `${(height - (width * 22) / 17) / 2}px`
    //   : "0px",
  };

  // useEffect(() => {
  //   var elmnt = document.getElementsByClassName("react-pdf__Page__canvas")[0];
  //   if (elmnt) {
  //     console.log(elmnt);
  //     console.log(elmnt["width"]);
  //     console.log(elmnt["height"]);
  //
  //     var heightTest = (width * 22) / 17;
  //     if (heightTest > height) {
  //       setPadding((height - heightTest) / 2);
  //     }
  //     console.log(heightTest);
  //     console.log(width);
  //     console.log(height);
  //   }
  // }, [height]);
  //
  // useEffect(() => {
  //   if (width && height) {
  //     // alert(width);
  //     // alert(height);
  //     setradio(width / height);
  //   }
  // }, [width, height]);
  //
  // paddingTop:
  //   (width * 22) / 17 <= height
  //     ? `${(height - (width * 22) / 17) / 2}px`
  //     : "0px",
  // paddingBottom:
  //   (width * 22) / 17 <= height
  //     ? `${(height - (width * 22) / 17) / 2}px`
  //     : "0px",

  useEffect(() => {
    if (!loading && width) {
      setTimeout(getPadding(width), 1000);
    }

    // alert(loading);
  }, [loading, viewStyle, width]);

  return (
    <>
      <div
        style={{
          width: width,
          height: height,
          paddingTop: 50

        }}
      >
        <div>
          <Document
            file={pdf}
            style={{ marginTop: "0px !important" }}
            options={{ workerSrc: "/pdf.worker.js" }}
            onLoadProgress={({ loaded, total }) => {
              // var percentProgress = (loaded / total) * 100
              // alert(percentProgress.toFixed(0));
              setloading(true);
              setPercent((loaded / total) * 100);
            }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              alert("Error while retrieving the outline! " + error.message);
              setStatus("exception");
            }}
          >
            <>
              {pageNumber && (
                <Page
                  pageNumber={pageNumber}
                  width={width < 768 ? width : 0}
                  height={height - 100}
                />
              )}
            </>
          </Document>
        </div>
      </div>
    </>
  );
}
