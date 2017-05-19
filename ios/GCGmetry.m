//
//  GCGmetry.m
//  newfuntasy
//
//  Created by hwanse on 2017. 5. 10..
//  Copyright © 2017년 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GCGmetry.h"
#import <GoogleMaps/GMSGeometryUtils.h>
#import <GoogleMaps/GMSMutablePath.h>

@implementation GCGmetry

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(
                  containsLocation:(NSDictionary *)point
                  polygon:(NSArray *)polygon
                  callback:(RCTResponseSenderBlock)callback)
{
  
  CLLocationCoordinate2D locationPoint = CLLocationCoordinate2DMake(
                                                                    [[point objectForKey:@"lat"] doubleValue],
                                                                    [[point objectForKey:@"lng"] doubleValue]
                                                                    );
  
  GMSMutablePath *polygonPath  = [GMSMutablePath path];
  
  for(int i = 0; i < [polygon count]; i++) {
    [polygonPath addCoordinate:CLLocationCoordinate2DMake(
                                                          [[polygon[i] objectForKey:@"latitude"] doubleValue],
                                                          [[polygon[i] objectForKey:@"longitude"] doubleValue]
                                                          )];
  }
  
  
  if (GMSGeometryContainsLocation(locationPoint, (GMSPath *)polygonPath, NO)) {
    // locationPoint is in polygonPath
    callback(@[@YES]);
  } else {
    // locationPoint is NOT in polygonPath.
    callback(@[@NO]);
  }
}

//RCT_EXPORT_METHOD(
//                  drawCircle:(NSDictionary *)center
//                  radius:(int)radius
//                  callback:(RCTResponseSenderBlock)callback)
//{
//  NSMutableArray *temp = [[NSMutableArray alloc] init];
//
//  double a = [[center objectForKey:@"lat"] doubleValue];
//  double b = [[center objectForKey:@"lng"] doubleValue];
//
//  // CLLocationCoordinate2D locationPoint = CLLocationCoordinate2DMake(a,b);
//
//  NSMutableDictionary *circlePoints = [[NSMutableDictionary alloc] init];
//  for(int i=0; i< 360; i++) {
//    [circlePoints setObject: [NSNumber numberWithDouble: a + radius * cos(i*M_PI/180)] forKey:@"lat"];
//    [circlePoints setObject: [NSNumber numberWithDouble: b + radius * sin(i*M_PI/180)] forKey:@"lng"];
//
//
//  }
//
//  NSLog(@"%@", circlePoints);
//
//  [temp addObject:circlePoints];
//
//  callback(circlePoints);
//
////  var a=[],p=360/points,d=0;
////  for(var i=0;i<points;++i,d+=p){
////    a.push(google.maps.geometry.spherical.computeOffset(center,radius,d));
////  }
////  console.log(a[0].lat);
////  return a;
////}
//
//}
@end
