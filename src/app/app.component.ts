/// <reference types="dwt" />
import { Component, OnInit } from "@angular/core"
import dwtConfig from "./dwt/config"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  baseAddress = "localhost"
  DWObject: WebTwain
  newIndices: any[] = []
  port = 5000
  visible = false

  download() {
    this.DWObject.RemoveAllImages()

    this.DWObject.HTTPPort = this.port
    // this.DWObject.IfSSL = true
    this.DWObject.SetHTTPHeader("Authorization", "Bearer xxx")
    this.DWObject.HTTPDownload(this.baseAddress, "/api/files/fileName/imageData.pdf", () => { }, (code, message) => {
      console.log(`${code} - ${message}`)
    })
  }

  initScan() {
    Dynamsoft.WebTwainEnv.Load()
    dwtConfig.applyConfig(Dynamsoft)
    Dynamsoft.WebTwainEnv.RegisterEvent("OnWebTwainReady", () => { this.Dynamsoft_OnReady() })
  }

  ngOnInit() {
    this.initScan()
  }

  Dynamsoft_OnReady(): void {
    this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain("dwtcontrolContainer")
    if (this.DWObject) {
      this.DWObject.Height = 600
      this.DWObject.ShowImageEditor("dwtcontrolContainerLargeViewer", 780, 600)
      this.DWObject.ShowPageNumber = true
      this.DWObject.SetViewMode(1, 4)
      this.DWObject.Width = 200
      if (this.DWObject.Addon && this.DWObject.Addon.PDF) {
        this.DWObject.Addon.PDF.SetResolution(300)
        this.DWObject.Addon.PDF.SetConvertMode(EnumDWT_ConvertMode.CM_RENDERALL)
      }
    }
  }

  scan() {
    this.visible = false
    setTimeout(() => {
      this.visible = true
    }, 500)
    setTimeout(() => {
      this.initScan()
    }, 500)
  }

  upload() {
    this.DWObject.ClearAllHTTPFormField()
    this.DWObject.HttpFieldNameOfUploadedImage = "RemoteFile"
    this.DWObject.HTTPPort = this.port
    // this.DWObject.IfSSL = true
    this.DWObject.SetHTTPFormField("json", JSON.stringify({}))
    this.DWObject.SetHTTPHeader("Authorization", "Bearer xxx")
    this.DWObject.HTTPUploadAllThroughPostAsPDF(
      this.baseAddress,
      "/api/files",
      "imageData.pdf",
      () => {
        this.scan()
      },
      (code, message, response) => {
        console.log(`${code} - ${message} - ${response}`)
        this.scan()
      }
    );
  }
}