import React, { useState, useEffect, useRef, createRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { StyleSheet } from "@react-pdf/renderer";
import { Spin, Progress, Button } from "antd";
import { useWindowSize } from "hooks/useWindowSize";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const styles = StyleSheet.create({
  page: { backgroundColor: "tomato", marginTop: "0px !important" },
  section: { color: "white", textAlign: "center", margin: 30 },
});
export default function Allpages(props) {
  const {
    pdf,
    pageNumber,
    onDocumentLoadSuccess,
    numPages,
    loading,
    setPageNumber,
  } = props;
  const [radio, setradio] = useState(0);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("active");
  const [paddingItem, setPaddingItem] = useState("0px");
  // const [numPages, setNumPages] = useState(1);
  // const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page
  const { width, height } = useWindowSize();
  const lineRefs = React.useRef([]);
  const callbackFunction = (e) => {
    const observer = e[0].target.getElementsByClassName("react-pdf__Page")[0];
    console.log(observer.dataset.pageNumber);
    setPageNumber(parseInt(observer.dataset.pageNumber));
  };

  const observer = new IntersectionObserver(callbackFunction, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });
  lineRefs.current = new Array(numPages).map(
    (_, i) => lineRefs.current[i] ?? createRef()
  );

  function showAlert(index) {
    // childRefs[index];
  }

  //
  //   useEffect(
  //   () => {
  // lineRefs.current = new Array(numPages).map((_, i) => lineRefs.current[i] ?? createRef());
  //     // if (resultsRef.current) {
  //     //   window.scrollTo({
  //     //     behavior: "smooth",
  //     //     top: resultsRef.current.offsetTop
  //     //   });
  //     // }
  //   },
  //   [numPages])
  //
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    var elmnt = document.getElementsByClassName("react-pdf__Document")[0];
    var elmnt_page = document.getElementsByClassName("react-pdf__Page")[0];
    if (elmnt && elmnt_page) {
      // console.log(elmnt.getBoundingClientRect().y);
      // console.log(elmnt_page.offsetHeight);
      let currentpostion = Math.abs(elmnt.getBoundingClientRect().y);
      let pageHeight = elmnt_page.offsetHeight + 20;

      if (currentpostion > pageHeight) {
        // console.log(currentpostion + elmnt_page.offsetHeight)
        currentpostion = currentpostion + pageHeight+100;
        let currentPage = (currentpostion / pageHeight).toFixed(0);
        setPageNumber(currentPage);
        // executeScroll(currentPage);
      } else {
        setPageNumber(1);
      }
    }
  }

  //   // if (
  //   //   window.innerHeight + document.documentElement.scrollTop !==
  //   //     document.documentElement.offsetHeight ||
  //   //   isFetching
  //   // )
  //   //   return;
  //   // setIsFetching(true);
  // }
  //
  // useEffect(() => {
  //
  //   setTimeout(() => {
  //     for (var i = 0; i < numPages; i++) {
  //       if (lineRefs.current[i]) {
  //         observer.observe(lineRefs.current[i]);
  //       }
  //     }
  //
  //     return () => {
  //       if (lineRefs.current[0]) observer.unobserve(lineRefs.current[0]);
  //     };
  //   }, 1500);
  // }, [numPages]);

  //   const arrow = (page) => {
  //      const executeScroll = () => lineRefs.current[page].scrollIntoView()
  // //     var elmnt = document.getElementsByClassName("react-pdf__Document")[0];
  // //     var elmnt_page = document.getElementsByClassName("react-pdf__Page")[0];
  // //     if (elmnt && elmnt_page) {
  // //       let pageHeight = elmnt_page.offsetHeight + 20;
  // // lineRefs
  // //       elmnt.scrollTop(200 * pageHeight);
  // //     }
  //   };
  // const executeScroll = (page) =>
  //   lineRefs.current[page].scrollIntoView({
  //     behavior: "smooth",
  //     block: "end",
  //     inline: "nearest",
  //   });
  //
  // useEffect(() => {
  //   if (lineRefs.current[pageNumber]) {
  //     executeScroll(pageNumber);
  //   }
  // }, [pageNumber, lineRefs]);
  return (
    <>

      {/**percent === 100 ? null : (
        <div
          style={{
            height: height,
            position: "relative",
          }}
        >
          <div className="vertical-center">
            <center>
              <Progress
                type="circle"
                percent={percent}
                width={80}
                status={status}
              />
            </center>
          </div>
        </div>
      )**/}

      <Document
        file={pdf}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadProgress={({ loaded, total }) => {
          // var percentProgress = (loaded / total) * 100
          // alert(percentProgress.toFixed(0));
          setPercent((loaded / total) * 100);
        }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          alert("Error while retrieving the outline! " + error.message);
          setStatus("exception");
        }}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div
            ref={(el) => {
              lineRefs.current[index] = el;
            }}
            style={{ marginBottom: "20px" }}
          >
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={(width * 22) / 17 > height ? (height * 17) / 22 : width}
            />
          </div>
        ))}
      </Document>
    </>
  );
}
