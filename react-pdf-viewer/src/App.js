import React, { useEffect, useState } from "react";

import SinglePagePDFViewer from "./components/pdf/single-page";
import AllPagesPDFViewer from "./components/pdf/all-pages";
import { sampleBase64pdf } from "./components/pdf/sampleBase64pdf";
/* This is required only if the project file is located
inside the app. Otherwise you can use the external link of the pdf file*/
import bitcoinpdf from "./components/pdf/bitcoin.pdf";
import blackout2pdf from "./components/pdf/BLACK-OUT-2.pdf";
import "antd/dist/antd.css";
import "./styles.css";
import {
  Slider,
  Row,
  Col,
  Typography,
  Button,
  Spin,
  Drawer,
  Radio,
} from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const samplePDF = blackout2pdf;
export default function App() {
  const [numPages, setNumPages] = useState(null);
  const [loading, setloading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = React.useState(1);
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page
  const [viewStyle, setViewStyle] = useState("Horizontal");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  function handleTouchStart(e) {
    if (viewStyle === "Horizontal") {
      setTouchStart(e.targetTouches[0].clientX);
    }
    // if (viewStyle === "Vertical") {
    //   setTouchEnd(e.targetTouches[0].clientY);
    // }
  }

  function handleTouchMove(e) {
    if (viewStyle === "Horizontal") {
      setTouchEnd(e.targetTouches[0].clientX);
    }
    // if (viewStyle === "Vertical") {
    //   setTouchEnd(e.targetTouches[0].clientY);
    // }
  }

  function handleTouchEnd() {
    if (viewStyle === "Horizontal") {
      if (touchStart - touchEnd > 75) {
        // do your stuff here for left swipe
        // moveSliderRight();
        previousPage();
      }

      if (touchStart - touchEnd < -75) {
        // do your stuff here for right swipe
        // moveSliderLeft();
        nextPage();
      }
    }

    // if (viewStyle === "Vertical") {
    //   if (touchStart - touchEnd > 75) {
    //     // do your stuff here for left swipe
    //     // moveSliderRight();
    //     previousPage();
    //   }

    // if (touchStart - touchEnd < -75) {
    //   // do your stuff here for right swipe
    //   // moveSliderLeft();
    //
    //   nextPage();
    // }
    // }
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setloading(false);
  }

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  //   setPageNumber(1);
  // }

  function changePage(offset) {
    // if (viewStyle === "Vertical") {
    //   setPageNumber(offset);
    // }
    if (viewStyle === "Horizontal") {
      setPageNumber(offset);
    }
    // if (offset < pageNumber) {
    //   previousPage();
    // }
    // if (offset > pageNumber) {
    //   nextPage();
    // }
    // setPageNumber(offset);
  }

  function previousPage() {
    if (pageNumber <= 1) {
      return;
    }
    setPageNumber(pageNumber - 1);
  }

  function nextPage() {
    if (pageNumber >= numPages) {
      return;
    }
    setPageNumber(pageNumber + 1);
  }
  const onChange = (e) => {
    console.log("radio checked", e.target.value);

    setViewStyle(e.target.value);
    setVisible(false);
  };
  // useEffect(() => {
  //   if (numPages) {
  //     setloading(false);
  //   }
  // }, [numPages]);

  return (
    <div
      className="App"
      onTouchStart={(touchStartEvent) => handleTouchStart(touchStartEvent)}
      onTouchMove={(touchMoveEvent) => handleTouchMove(touchMoveEvent)}
      onTouchEnd={() => handleTouchEnd()}
    >
      <div
        className="header--pin"
        style={{ textAlign: "center", opacity: "1", color: "red" }}
      >
        <Row>
          <Col flex="auto" className="pt-4"></Col>
          <Col flex="100px" style={{ paddingTop: "30px" }}>
            <Button
              onClick={() => setVisible(!visible)}
              type="link"
              icon={
                visible ? (
                  <CloseOutlined
                    style={{ fontSize: "28px", color: "#f43f54" }}
                  />
                ) : (
                  <MenuOutlined style={{ fontSize: "28px", color: "white" }} />
                )
              }
              size="large"
            />
          </Col>
        </Row>
      </div>

      {viewStyle == "Horizontal" && (
        <SinglePagePDFViewer
          pdf={samplePDF}
          pageNumber={pageNumber}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          numPages={numPages}
          setloading={setloading}
          loading={loading}
          viewStyle={viewStyle}
        />
      )}
      {viewStyle == "Vertical" && (
        <AllPagesPDFViewer
          pdf={samplePDF}
          pageNumber={pageNumber}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          numPages={numPages}
          loading={loading}
          setPageNumber={setPageNumber}
          viewStyle={viewStyle}
        />
      )}

      <div
        className="footer--pin"
        style={{ textAlign: "center", opacity: "1", color: "White" }}
      >
        <Row>
          <Col flex="auto" className="p-4">
            {" "}
            <Slider
              reverse
              min={1}
              max={numPages}
              step={1}
              onChange={changePage}
              value={typeof pageNumber === "number" ? pageNumber : 0}
            />
          </Col>
          <Col flex="100px" style={{ paddingTop: "30px" }}>
            <Title style={{ color: "white" }} level={5}>
              <span style={{ color: "#ffffff" }}>{pageNumber} /</span>{" "}
              <span style={{ color: "#bfbfbf" }}>{numPages}</span>
            </Title>
          </Col>
        </Row>
      </div>

      {/**
  <hr />

  <h4>All Pages</h4>
  <div className="all-page-container">
    <AllPagesPDFViewer pdf={samplePDF} />
  </div>

  <hr />

  <h4>Base 64 Single Page</h4>
  <SinglePagePDFViewer pdf={sampleBase64pdf} />

  <hr />
  **/}
      <Drawer
        maskStyle={{ background: "transparent" }}
        mask={true}
        maskClosable={true}
        placement={"right"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={"right"}
        style={{ color: "white" }}
        width={450}
        zIndex={999}
      >
        <div className="vertical-center">
          <center>
            <p style={{ color: "#f5ce05", fontSize: "16px" }}>ทิศทางการอ่าน</p>
            <Radio.Group
              onChange={onChange}
              value={viewStyle}
              defaultValue={"Horizontal"}
              buttonStyle={"solid"}
              size={"large"}
            >
              <Radio value={"Vertical"}>
                {" "}
                <Text style={{ color: "white", fontSize: "18px" }}>
                  Vertical
                </Text>{" "}
              </Radio>
              <Radio value={"Horizontal"}>
                {" "}
                <Text style={{ color: "white", fontSize: "18px" }}>
                  Horizontal
                </Text>{" "}
              </Radio>
            </Radio.Group>
          </center>
        </div>
      </Drawer>
    </div>
  );
}
