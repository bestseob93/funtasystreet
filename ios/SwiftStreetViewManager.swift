//
//  SwiftStreetViewManager.swift
//  newfuntasy
//
//  Created by hwanse on 2017. 4. 1..
//  Copyright © 2017년 Facebook. All rights reserved.
//

import Foundation

@objc(SwiftStreetViewManager)
class SwiftStreetViewManager : RCTViewManager {
  
  override func view() -> UIView! {
    //    SwiftStreetView().delegate = self
    
    return SwiftStreetView();
  }
  
}
