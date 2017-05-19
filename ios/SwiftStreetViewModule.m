//
//  SwiftStreetViewModule.m
//  newfuntasy
//
//  Created by hwanse on 2017. 4. 1..
//  Copyright © 2017년 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(SwiftStreetViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(locationLabel, NSString)
RCT_EXPORT_VIEW_PROPERTY(coordinate, CLLocationCoordinate2D)

@end
