//
//  SwiftStreetView.swift
//  newfuntasy
//
//  Created by hwanse on 2017. 4. 1..
//  Copyright © 2017년 Facebook. All rights reserved.
//

import UIKit
import Foundation
import GoogleMaps

@objc(SwiftStreetView)
class SwiftStreetView: RCTView, GMSPanoramaViewDelegate {
  
  // var StreetViewController = SwiftStreetViewController()
  //  @IBOutlet weak open var delegate: GMSPanoramaViewDelegate?
  var panoView = GMSPanoramaView()
  var label: UILabel!
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    
    //  let appDelegate = UIApplication.shared.delegate as? AppDelegate
    //    appDelegate?.window.rootViewController?.present(StreetViewController, animated: true, completion: nil)
    let bounds = UIScreen.main.bounds
    let width = bounds.size.width
    let height = bounds.size.height
    
    
    
    panoView.frame = CGRect(x: 0, y: 0, width: width, height: height-90)
    panoView.moveNearCoordinate(CLLocationCoordinate2DMake(37.654387,127.0445381))
    panoView.camera = GMSPanoramaCamera(heading: 270, pitch: 40, zoom: 1)
    panoView.orientationGestures = true
    panoView.navigationGestures = false
    panoView.delegate = self
    self.addSubview(panoView)
    //appDelegate?.window.rootViewController?.view.addSubview(self)
    //self.insertSubview(panoView, belowSubview: (appDelegate?.window.rootViewController?.view)!)
    setLabelAddress(width: width, height: height)
  }
  
  func setLabelAddress(width: CGFloat, height: CGFloat) {
    label = UILabel()
    label.frame = CGRect(x: 0, y: height-150, width: width, height: 40)
    label.text = "불러오는 중.."

    label.textColor = UIColor.white
    label.layer.backgroundColor = UIColor(red: 0/255, green: 0/255, blue: 0/255, alpha: 0.7).cgColor
    label.layer.cornerRadius = 4
    label.sizeToFit()
    
    self.addSubview(label)
  }
  
  func setLocationLabel(_ locationLabel: NSString) {
    label.text = "\(locationLabel)"
    label.sizeToFit()
  }
  
  func setCoordinate(_ coordinate: CLLocationCoordinate2D) {
    panoView.moveNearCoordinate(CLLocationCoordinate2DMake(coordinate.latitude, coordinate.longitude))
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
}
