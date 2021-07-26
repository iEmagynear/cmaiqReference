import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ChartService } from "../../../services/chart.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DialogClientComponent } from "./../dialog-client/dialog-client.component";
import { DialogPropertyComponent } from "./../dialog-property/dialog-property.component";
import { MouseEvent } from "@agm/core";
import {
  GoogleMapsAPIWrapper,
  AgmMap,
  LatLngBounds,
  LatLngBoundsLiteral,
} from "@agm/core";
declare var google: any;
import Swal from "sweetalert2";
import { DataService } from "../../../services/data.service";
import { PaymentService } from "../../../services/payment.service";
import { StatusService } from "../../../services/status.service";
import { TimerService } from "../../../services/timer.service";
import { Subject, timer, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { OmpComponent } from "./../omp/omp.component";
import { SharedMlsService } from "../../../services/shared-mls.service";

@Component({
  selector: "app-comparable",
  templateUrl: "./comparable.component.html",
  styleUrls: ["./comparable.component.scss"],
  providers: [
    ChartService,
    DataService,
    PaymentService,
    StatusService,
    TimerService,
  ],
})
export class ComparableComponent implements OnInit, AfterViewInit {
  //@Output() searchPropertiesdata: EventEmitter<any> =   new EventEmitter();
  searchPropertiesdata;
  callomp = false;
  isLeftVisible = true;
  loaderzip = false;
  loadersub = false;
  minutesDisplay = 0;
  secondsDisplay = 0;
  endTime = 1;
  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;
  timeOutExceeded = true;
  initLoadNum = 200;
  lastFilter: string = "";
  lazyLoadNum: number = 200;
  showPolygonButton = true;
  showCircleButton = true;
  resultsCheck = false;
  centerMarker;
  centerCheck;
  enablepolygon = false;
  enableCircle = false;
  isExtraFields: boolean = false;
  hasRental: boolean = false;
  isCTAR: boolean = false;
  extraFields;
  total_count = 0;
  active_count = 0;
  pending_count = 0;
  cancel_count = 0;
  drawingManager;
  loader = false;
  successmsg;
  addChart;
  public optionSelected;
  public selectedImg;
  public groupName;
  public selectPropertyMsg = false;
  clearpolygon = false;
  showpolygon = true;
  clearCircle = false;
  showCircle = true;
  public subDivisions = [];
  public areas = [];
  public zipCode = [];
  public minimumDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  public maximumDate = new Date();
  properties = [];
  property_id;
  mls_name;
  paths = [];
  selected_markers = [];
  selectedMarkers = [];
  // google maps zoom level
  zoom: number = 3;
  mapMarkers: any = [];
  initialPayload = [];
  // initial center position for the map
  lat: number = 39;
  lng: number = -94;
  markers = [];
  mapObj;
  poly;
  circle;
  homes;
  mapCenter;
  addchartformdata;
  addchartpropertyid;
  client_id;
  addchartclientid;
  hasSeven;
  hasThree;
  tooBig;
  genChartButtonError = true;
  saveBody;
  max_date;
  currentId;
  public ShowChartBtn = false;
  public clearSelect = true;
  @ViewChild("AgmMap") agmMap: AgmMap;
  Subs: any = [];
  Area: any = [];
  Zips: any = [];
  showft = true;
  //showft1 = true;
  PCBORShow = false;
  pcborAreaSelected = false;
  wildcardCheckPass = false;
  Id;
  maxCount = 249;
  currentApi: string;
  lastLength: number;
  myOptions: any[];
  noresultTexts: any;
  myTexts: any;
  loadingTexts: any;
  request: Subscription;
  selectedsub: any;
  selectedarea: any;
  request2: Subscription;
  myOptions2: any;
  lastFilter2: string = "";
  selectedzip: any;
  searcherrordata;
  searcherrornothing;
  searcherrordatahtml;
  searcherrornothinghtml;
  CreateChartError;
  CreateChartErrortext;
  DateRangeError;
  DateRangeErrortext;
  MaximumResultsExceeded;
  MaximumResultsExceededtext;
  MinimumResultsError;
  MinimumResultsErrortext;
  pcborAreas = [
    "00 - None",
    "01 - Old Town",
    "02 - Thaynes Canyon",
    "03 - Lower Deer Valley Resort",
    "04 - Deer Crest",
    "05 - Upper Deer Valley Resort",
    "06 - Empire Pass",
    "07 - Aerie",
    "08 - Prospector",
    "09 - Park Meadows",
    "10 - Canyons Village",
    "11 - Sun Peak/Bear Hollow",
    "12 - Silver Springs Area",
    "13 - Old Ranch Road",
    "14 - Kimball",
    "15 - Pinebrook",
    "16 - Summit Park",
    "17 - Jeremy Ranch",
    "18 - Glenwild",
    "19 - Silver Creek Estates",
    "20 - Trailside Park Area",
    "21 - Silver Creek South",
    "22 - Promontory",
    "23 - Quinn's Junction",
    "24 - Jordanelle Park",
    "25 - Deer Mountain",
    "26 - Tuhaye/Hideout",
    "27 - South Jordanelle",
    "30 - Midway",
    "31 - North Fields",
    "32 - Heber North",
    "33 - Red Ledges",
    "35 - South Fields",
    "36 - Heber",
    "37 - Heber East",
    "38 - Timberlakes",
    "40 - Independence",
    "41 - Daniel",
    "42 - Charleston",
    "43 - Wallsburg",
    "46 - Sundance & Provo Canyon",
    "48 - Other Wasatch",
    "50 - Woodland and Francis",
    "51 - Kamas & Marion",
    "52 - Oakley & Weber Canyon",
    "53 - Peoa and Browns Canyon",
    "54 - Wanship, Hoytsville, Coalville, Rockport",
    "56 - Morgan County, Henefer & Echo",
    "57 - Huntsville/Snowbasin/Eden/Liberty",
    "58 - Wasatch Front (Ogden, Salt Lake City)",
    "59 - Other Utah",
    "60 - National",
    "61 - International",
  ];
  pcborSubs = [
    //01
    "205 Main St. Condominiums",
    "310 Marsac Place",
    "All Seasons",
    "Alpenhof",
    "Alpine Retreat",
    "Alpine Shadows",
    "Aspen Grove",
    "Blue Church Lodge",
    "Bonanza Flats",
    "Caledonian",
    "Canyon View",
    "Caribou Lodge",
    "Claimjumper",
    "Coalition Lodge",
    "Columbine",
    "Commercial Land",
    "Copper Bottom Inn",
    "Cottages on the Park",
    "Craigs",
    "Crescent Ridge",
    "Daly Avenue (255 Daly Avenue)",
    "Daly Avenue Twin Homes",
    "Daly Condominiums (141 Daly Condominiums)",
    "Daly Doubles",
    "Daly West",
    "Double Jack",
    "Echo Spur",
    "Edelweiss Haus",
    "Empire Canyon",
    "Empire Coalition",
    "Empire House",
    "Fashion Coalition",
    "Fisher",
    "Four Aces",
    "Fourteenth St Townhouse",
    "Foxglove Cottages",
    "Funks Place",
    "Galleria",
    "Gambler",
    "Greyhawk",
    "Hearthstone",
    "Heber Avenue Condominiums",
    "Homestake",
    "Hotel Park City",
    "Hunter Villa",
    "Interline",
    "Jefferson House",
    "John Doyle House",
    "Jupiter Peak Lodge",
    "King Road Subdivision",
    "Kings Crown",
    "La Casa Grande",
    "Lift Line",
    "Lift Lodge",
    "Marriott Mountainside",
    "Marriott Summit Watch",
    "Marsac Mill Manor",
    "Marsac Place",
    "Millsite Reservation",
    "Mine Camp",
    "Moose Lodge At Park City",
    "Motherlode",
    "Mountain Wood",
    "Norfolk Lode",
    "North Star",
    "Northridge",
    "Old Town Area",
    "Olive Branch",
    "Ontario Avenue (253 Ontario Avenue)",
    "Ontario Avenue Subdivision",
    "Park Avenue",
    "Park Avenue (820 Park Avenue)",
    "Park Avenue Commercial",
    "Park Avenue Condominiums",
    "Park City Survey",
    "Park City Village",
    "Park Hotel",
    "Park Palace",
    "Park Place",
    "Park Station",
    "Parkside Ski Condominiums",
    "Parkwood",
    "Parkwood Place",
    "Payday",
    "Pearl West",
    "Pinion Pine",
    "Poison Creek Mercantile",
    "Portico",
    "Potters Corner",
    "Powder Keg",
    "Powder Pointe",
    "Powder Ridge",
    "Quakie",
    "Quicksilver",
    "Quittin Time",
    "Rectories",
    "Resort Center",
    "Resort Townhomes",
    "Retreat at the Park",
    "Roundabout",
    "Settlers Ridge",
    "Shadow Ridge",
    "Shaft",
    "Silver Cliff Village",
    "Silver King",
    "Silver Mill House",
    "Silver Mine West",
    "Silver Pointe",
    "Silver Queen",
    "Silver Skis",
    "Silver Star - Spiro Condominiums",
    "Silver Star - The Cottages",
    "Silverbell",
    "Silvertown",
    "Ski Team",
    "Skiers Lodge",
    "Sky Lodge",
    "Sky Silver",
    "Sky Strada",
    "Snow Blaze/Wildwood",
    "Snow Country",
    "Snow Flower",
    "Snow Haven",
    "Snow Park Subdivision",
    "Snowcrest",
    "Snyders Addition",
    "Struggler",
    "Sunflower",
    "Sunnyside",
    "Sunnyside Up",
    "Sunspot",
    "Sweetwater",
    "Temptation",
    "The Gables",
    "The Line Condominiums",
    "The Lofts on Deer Valley Drive",
    "The Lowell",
    "The Parkite",
    "Three Kings",
    "Town Lift",
    "Town Pointe",
    "Townhome (587 Townhome)",
    "Treasure Mountain Inn",
    "Upper Norfolk Avenue Condominiums",
    "Victorian Village",
    "Village Loft",
    "Walk to Slopes",
    "Wasatch",
    "Washington Mill",
    "Woodside Chalet",
    "Yellow Slicker",
    //02
    "Aspen Springs Ranch",
    "Commercial Land",
    "Iron Canyon",
    "Thaynes Canyon",
    "Thaynes Canyon Area",
    "Thaynes Creek Ranch",
    //03
    "Aspen Wood",
    "Black Diamond Lodge",
    "Boulder Creek",
    "Bristlecone",
    "Chaparral",
    "Chateau Fawngrove",
    "Commercial Land",
    "Comstock Lodge",
    "Courchevel",
    "Daystar/Amber Daystar",
    "Deer Lake Village",
    "Deer Valley North Parcel",
    "Fawngrove",
    "Glenfiddich",
    "Hidden Meadows",
    "Hidden Oaks",
    "In the Trees",
    "La Maconnerie",
    "Lakeside",
    "Lodges At Deer Valley",
    "Lower Deer Valley Area",
    "Morning Star Estates",
    "Nordic Village",
    "Pine Inn",
    "Pinnacle",
    "Powder Run",
    "Queen Esther Village",
    "Red Stag Lodge",
    "Royal Oaks",
    "Silver Baron",
    "Solamere",
    "Stonebridge",
    "The Oaks At Deer Valley",
    "Trails End At Deer Valley",
    "Trails End Lodge",
    "Wildflower - Deer Valley",
    //04
    "Commercial Land",
    "Deer Creek Estates",
    "Deer Creek Townhomes",
    "Deer Crest Area",
    "Deer Crest Estates",
    "Deer Crest Village",
    "Deer Pointe",
    "Hidden Hollow",
    "Snow Top",
    "St. Regis",
    //05
    "Alpen Rose",
    "Alta Vista",
    "American Flag",
    "Aspen Hollow",
    "Bald Eagle Club",
    "Bellearbor",
    "Bellemont",
    "Belleterre",
    "Bellevue",
    "Black Bear Lodge",
    "Cache At Silver Lake",
    "Chateaux At Silver Lake",
    "Commercial Land",
    "Deer Valley Club",
    "Double Eagle",
    "Enclave",
    "Evergreen",
    "Goldener Hirsch",
    "Knoll At Silver Lake",
    "Knoll Estates/Deer Valley Club Estates",
    "Knollheim",
    "Little Belle",
    "Lookout At Deer Valley",
    "Mont Cervin",
    "Ontario Lodge",
    "Ridge",
    "Ridgepoint",
    "Royal Plaza",
    "Silver Bird",
    "Silver Lake Village",
    "Stag Lodge",
    "Stein Eriksen Lodge",
    "Stein Eriksen Residences",
    "Sterling Lodge",
    "Sterlingwood",
    "The Cottages",
    "The Inn At Silver Lake",
    "The Residences At the Chateaux",
    "Trailside",
    "Twin Pines At Silver Lake",
    "Upper Deer Valley Area",
    "Woods At Deer Valley",
    //06
    "Arrowleaf",
    "Bannerwood",
    "Commercial Land",
    "Empire Residences",
    "Flagstaff",
    "Grand Lodge",
    "Ironwood",
    "Larkspur",
    "Montage Deer Valley",
    "Nakoma",
    "Northside Village",
    "One Empire Pass",
    "Paintbrush",
    "Red Cloud",
    "Shooting Star",
    "Silver Cloud",
    "Silver Strike Lodge Condominium",
    "The Belles at Empire Pass",
    //07
    "Aerie Area",
    "April Mountain",
    "Commercial Land",
    "Overlook",
    //08
    "Canyon Crossing",
    "Carriage House",
    "Chatham Crossing/Fenchurch",
    "Chatham Hills",
    "Commercial Land",
    "Fireside",
    "Iron Horse",
    "Iron Horse Industrial",
    "Ironhorse Park Commercial",
    "New Claim",
    "Park City Heights",
    "Park Plaza",
    "Park Regency",
    "Prospector Area",
    "Prospector Park",
    "Prospector Square Condos",
    "Prospector Square Subdivision (PSA)",
    "Prospector Village",
    "Sun Creek",
    //09
    "Boothill Condos at Park Meadows",
    "Broken Spoke",
    "Commercial Land",
    "Cove At Eagle Mountain",
    "Eagle Pointe",
    "Fairway Hills",
    "Fairway Meadows",
    "Fairway Village",
    "Finnegans Bluff",
    "Four Lakes Village",
    "Gleneagles",
    "Holiday Ranchettes",
    "Jupiter Inn",
    "Lakeview Cottages",
    "Last Sun At the Cove",
    "Mcleod Creek",
    "Meadows Estates",
    "Mountain Ridge",
    "Mountain Top",
    "Park Meadows",
    "Parkview",
    "Racquet Club",
    "Ridgeview",
    "Ridgeview Townhomes",
    "Risner Ridge",
    "Saddle",
    "Sandstone Cove",
    "Sunny Slopes in Park Meadows",
    "The Gallery at The Cove at Eagle Mountain",
    "West Ridge",
    "Willow Ranch",
    "Windrift",
    //10
    "Apex Residences",
    "Aspen Creek Crossing",
    "Blackstone Residences",
    "Canyon Residences",
    "Club Regent",
    "Colony At White Pine Canyon",
    "Commercial Land",
    "Dutch Draw At Canyon Estates",
    "Eagles Dance",
    "Fairway Springs Ski and Golf Villas Condominiums",
    "Frostwood Villas",
    "Grand Summit Hotel",
    "Hidden Creek",
    "Hyatt Centric Park City",
    "Juniper Landing",
    "Lift Condominiums",
    "Lodge at Westgate",
    "Park West Village",
    "Park West/Hidden Creek",
    "Pendry Residences Park City",
    "Red Pine",
    "Silverado Lodge",
    "Sundial Lodge",
    "Sunrise At Escala",
    "The Canyons Area",
    "The Miners Club",
    "The Ridge at Canyons Village",
    "Timber Wolf Lodges",
    "Timberwolf Estates",
    "Village Round",
    "Vintage on the Strand",
    "Viridian Townhomes",
    "Waldorf Astoria",
    "White Pine Canyon",
    "White Pine Canyon Village",
    "White Pine Lodges",
    "White Pine Ranches",
    "YOTELPAD Condominiums",
    //11
    "Bear Hollow Ridge",
    "Bear Hollow Village",
    "Cedar Draw",
    "Cedar Draw Estates",
    "Commercial Land",
    "Enclave At Cedar Draw",
    "Enclave At Sun Canyon",
    "Lodges At Bear Hollow Village",
    "Mahogany Hills",
    "Sun Peak",
    "The Cove At Sun Peak/Winter Park",
    "Willow Draw Cottages",
    //12
    "Commercial Land",
    "Meadow Springs",
    "Meadow Wild",
    "Northshore",
    "Ptarmigan",
    "Quail Meadows",
    "Ranch Place",
    "Silver Meadows",
    "Silver Springs",
    "Snyders Mill",
    "Southshore",
    "Willow Bend East/Silver Springs Townhomes",
    "Willow Bend West",
    //13
    "Brookside Estates",
    "Brookside Estates on Two Creeks Lane",
    "Commercial Land",
    "Creek Ranch Estates",
    "Gt Flinders",
    "Juddabeth",
    "Old Ranch Road Area",
    "Quarry Mountain Ranch",
    "Ranch Creek",
    "Shadow Mountain",
    "Treasure Mountain Estates",
    "Two Creeks",
    "Willow Creek Estates",
    //14
    "Blackhawk Station",
    "Canyon Creek",
    "Commercial Land",
    "Crestview Condos",
    "Fiddich Glen",
    "Fox Point At Redstone",
    "Kimball Junction Area",
    "Nevis at Newpark",
    "Newpark Hotel",
    "Newpark Resort Residences",
    "Newpark Terrace",
    "Park City RV Resort",
    "Powder Mountain",
    "Powderwood",
    "Spring Creek",
    "Trout Creek",
    //15
    "Boothill",
    "Brook Hollow Village",
    "Cedar Ridge",
    "Commercial Land",
    "Courtyards At Quarry Village",
    "Discovery Ridge",
    "Eagle Ridge",
    "Ecker Hill",
    "Ecker Village",
    "Elk Run",
    "High Meadows At Pinebrook",
    "Horsethief Canyon",
    "Kilby Road",
    "Pine Creek",
    "Pinebrook",
    "Pinebrook Cottages",
    "Pinebrook Pointe",
    "Pineridge",
    "Quarry Springs",
    "Ranch Condominiums",
    "Sunridge",
    //16
    "Aspenbrook",
    "Commercial Land",
    "Summit Park",
    "Summit Park Area",
    "Timberline",
    //17
    "Back Nine",
    "Canyon Links",
    "Circle J Club",
    "Commercial Land",
    "Creek View Estates",
    "Hidden Cove",
    "Jeremy Cove",
    "Jeremy Point - Viewpoint",
    "Jeremy Point Golf Villas",
    "Jeremy Ranch Area",
    "Jeremy Ranch Club",
    "Jeremy Woods",
    "Kilby - North of I-80",
    "Kilby On Parleys Lane",
    "Moose Hollow",
    "Overlook at Jeremy Ranch",
    "SkyRidge",
    "South Ridge",
    "Sunrise Hills",
    "The Trails at Jeremy Ranch",
    "The Woods of Parley's Lane",
    "Viewpointe",
    "Wildflower - Jeremy",
    //18
    "Glenwild",
    "Goshawk Ranch",
    "Knob Hill",
    "Ranches At the Preserve",
    "Stagecoach Estates",
    "The Preserve",
    //19
    "Aspen Ridge Ranch",
    "Blackhawk Ranch",
    "Commercial Land",
    "East Creek Ranch",
    "Greenfield Ranches",
    "Majestic Mountain",
    "Red Hawk",
    "Silver Creek",
    //20
    "Commercial Land",
    "Highland Estates",
    "Mountain Ranch Estates",
    "Park Ridge Estates",
    "Round Valley Ranches",
    "Sagebrook",
    "Silver Summit",
    "Sun Meadow",
    "Trailside Park",
    //21
    "Commercial Land",
    "Silver Creek Village",
    "Silver Gate Ranches",
    "The Village Park City",
    //22
    "Aspen Camp",
    "Bison Bluffs",
    "Buffalo Jump",
    "Deer Crossing",
    "Dye Course Cabins",
    "Elk Ridge Heights",
    "Golf Club Cabins",
    "Lookout Ridge",
    "Nicklaus Private Estates At Painted Shores",
    "Nicklaus Residences",
    "Nicklaus Villas",
    "Northgate Canyon",
    "Painted Sky",
    "Promontory",
    "Promontory Area",
    "Promontory Ridge",
    "Ranch Club Cabins",
    "Range Hill",
    "Signal Hill",
    "Silver Gate Ranches",
    "Sunset Ridge",
    "The Homesteads",
    "The Palisades",
    "The Summit",
    "Trapper's Cabins",
    "Wapiti Canyon",
    "West Hills",
    "West View",
    //23
    "Commercial Land",
    "Olpin Mort and Greater PC",
    //24
    "Fox Bay",
    "Hailstone",
    "Jordanelle Village",
    "Lodge At Stillwater",
    "Shoreline Village",
    "Shores at Stillwater",
    "SkyRidge",
    "Star Harbour Estates",
    "The Views at Stillwater",
    "Village at the Shores",
    "Village at the Shores - Cedar Edition",
    "Village at the Shores - Oak Edition",
    //25
    "Black Rock Ridge",
    "Deer Mountain",
    "Deer Mountain-Keetley Station",
    "Deer Mountain-Ross Creek",
    "Deer Vista",
    "East Park",
    "Gardner Addition",
    "Park East",
    "Park's Edge",
    "The Retreat At Jordanelle",
    "Wasatch Springs",
    //26
    "Forevermore Estates",
    "Glistening Ridge",
    "Golden Eagle",
    "Hideout Canyon",
    "Hideout City (not Canyon)",
    "Klaim",
    "Overlook Village",
    "Reflection Ridge",
    "Rustler at Hideout Canyon",
    "Silver Sky",
    "Silver Strike Subdivision",
    "Soaring Hawk at Hideout",
    "Tuhaye",
    //27
    "None",
    "River View",
    "Talisman",
    "Victory Ranch",
    //30
    "Appenzell",
    "Aspen Park No. 1",
    "Brighton Estates",
    "Burgi Hill Ranches",
    "Cascades at Soldier Hollow",
    "Commercial Land",
    "Cottage Creek",
    "Cottages At Canyon View",
    "Cottages on the Green",
    "Creek Place",
    "Deer Ridge Estates",
    "Dutch Fields",
    "Farms At Tate Lane",
    "Fox Den Estates",
    "Fox Pointe",
    "Interlaken",
    "K & J",
    "Lacy Lane Estates",
    "Lime Canyon Estates",
    "Lodges At Snake Creek",
    "Matterhorn",
    "Meadow Creek Estates - Midway",
    "Midway",
    "Midway Valley Estates",
    "Midway Village",
    "Montresee",
    "Mountain Springs",
    "Oak Haven",
    "Pine Canyon",
    "River Meadows Ranch",
    "Scotch Fields",
    "Sunburst Ranch",
    "Swiss Alpenhof",
    "Swiss Creek Chalets",
    "Swiss Farm",
    "Swiss Mountain Estates",
    "Swiss Oaks",
    "Swiss Paradise",
    "The Farm At Deer Meadow",
    "The Hamlet",
    "The Links At the Homestead",
    "Turnberry",
    "Turnberry Woods",
    "Valais",
    "Village on the Green",
    "Wintergreen",
    "Wintergreen-Grindelwald",
    "Winterton Farms",
    "Zermatt Villas",
    //31
    "North Fields",
    //32
    "The Cove at Valley Hills",
    "The Cove Estates",
    "Valley Heights",
    "Valley Hills",
    "Wasatch View",
    //33
    "Red Ledges",
    //35
    "Alpine Acres",
    "Aspen Pointe",
    "Autumn Meadows",
    "Country Meadow Estates",
    //36
    "Alpine Acres",
    "Broadhead Estates",
    "Cottages at Valley Station",
    "Harvest Fields",
    "Hat Creek",
    "Heber and Daniels Area",
    "Heber City",
    "Mill Road Estates",
    "Mountain View Estates",
    "Muirfield",
    "Old Mill Estates",
    "Timp Meadows",
    "Timpview Acres",
    "Triple Crown",
    "Wheeler Park",
    //37
    "Beaufontaine",
    "Big Pole Estates",
    "Cobblestone",
    "Commercial Land",
    "Cottonwoods At Lake Creek",
    "Crossings At Lake Creek",
    "Greenerhills",
    "Lake Creek",
    "Lake Creek Farms",
    "Sage Creek Farms-Heber",
    "Stonebridge Farms",
    "Ucanogos",
    "Wild Mare",
    //38
    "Commercial Land",
    "Timberlakes Area",
    //40
    "Storm Haven",
    //41
    "Commercial Land",
    "Daniel",
    "Daniel Ranches",
    "Daniels Estates",
    "Daniels Gate",
    "Daniels Summit",
    //42
    "Charleston",
    "Charleston Estates",
    "Winterton Farms",
    //43
    "Commercial Land",
    "Slipper Hollow Ranch",
    "Wallsburg",
    //46
    "Canyon Meadows",
    "Commercial Land",
    "Creek Hollow Estates",
    "Mandan Cottages",
    "Provo Canyon Area",
    "River Run Cottages",
    "Stewart Cascades",
    "Sundance",
    "Timphaven",
    //48
    "Closed Outdated",
    "Commercial Land",
    "Wasatch County Area",
    //50
    "Commercial Land",
    "Coonradt",
    "Diamond Bar X",
    "Elk Meadows",
    "Francis",
    "Francis Acres",
    "Kirkham Estates",
    "River Bluffs",
    "Rock Cliff Ranches",
    "Summit Haven",
    "The Bluffs",
    "Uinta Shadows",
    "Uinta Willows",
    "Wild Willow",
    "Wolf Creek Ranch",
    "Woodland and Francis Area",
    "Woodland Estates",
    "Woodland Hills",
    "Woodland Park",
    //51
    "B and L",
    "Beaver Creek at Kamas",
    "Beaver Creek Estates",
    "Canyon Creek",
    "Canyon Creek Kamas",
    "Commercial Land",
    "Foothill Estates",
    "Garff Ranches",
    "Grassy Creek",
    "High Star Ranch",
    "Kamas and Marion Area",
    "Kamas Commons",
    "Kamas East",
    "Kamas East-Svr",
    "Marion",
    "Marion Meadows",
    "Meadowview",
    "Pine Plateau Estates",
    "Ranch Cabin Subdivision at High Star Ranch",
    "Sage Creek Farms-Kamas",
    "Samak Acres",
    "Samak Estates",
    "Samak Hills",
    "Samak Park",
    "Spring Meadows",
    "The Village at Lambert Lane",
    "Uinta View Condominiums",
    "Wakefield",
    "Webster Estates",
    "Willow Brook",
    //52
    "Aspen Acres",
    "Aspen Mountain",
    "Beaver Springs",
    "Canyon Rim Ranch",
    "Commercial Land",
    "Deer Haven",
    "Elder Acres",
    "Franson Estates",
    "Gilbert Meadows",
    "Hidden Lakes",
    "Horse Hollow Ranch",
    "Hylander Horse Haven",
    "Maple Ridge Ranches",
    "Mountain Valley Ranches",
    "North Bench Farms",
    "Oakley",
    "Oakley Bench Estates",
    "Oakley Meadows",
    "Pine Mountain",
    "Pioneer Shadow",
    "River Ridge Estates",
    "Rockin-A-Estates",
    "Snapp-South Field",
    "Weber Canyon",
    "Weber Meadowview",
    "Weber Wild",
    "Wilderness Acres",
    //53
    "Brown's Canyon",
    "Commercial Land",
    "Elk Ridge",
    "Peoa and Browns Canyon Ar",
    //54
    "Beacon Hill II (2)",
    "Bradbury Canyon",
    "Bridge Hollow",
    "Chalk Creek",
    "Coalville",
    "Commercial Land",
    "Cottonwood Acres",
    "Echo",
    "Echo Creek Ranches",
    "Forest Meadows",
    "Fox Run",
    "Franklin Canyon",
    "Grass Creek Estates",
    "Henefer",
    "Hoytsville",
    "Indian Hills",
    "Lake View Estates",
    "Mt Lewis Ranches",
    "North Summit",
    "Pine Meadows",
    "Ranches",
    "Rockport",
    "Rockport Estates",
    "Rockport Ranches",
    "Sorrel Ridge",
    "Tollgate",
    "Tollgate – Unassigned",
    "Walker View Estates",
    "Wan.- Hoyt - Coal.- Rock.",
    "Wanship",
    //56
    "Commercial Land",
    "Morgan Co - Henefer and Echo Ar.",
    //57
    "Commercial Land",
    "Durfee Creek",
    "Eagle Ridge Cluster",
    "Eden",
    "Elkhorn At Wolf Creek Resort",
    "Huntsville/Snowbasin Area",
    "North Fork Meadows",
    "Powder Mountain",
    "Reserve At Crimson Ridge",
    "Sanctuary Utah",
    "Snowbasin",
    "The Fairways",
    "The Highlands At Wolf Creek Resort",
    "The Ridge Townhomes",
    "Trapper's Ridge",
    "Wolf Lodge",
    "Wolf Star",
    //58
    "American Towers",
    "Cliff Club",
    "Commercial Land",
    "Eastwood Hills",
    "Emigration Canyon",
    "Highpoint",
    "Iron Blossom Lodge",
    "Superior Lodge",
    "Wasatch Front Ar 38",
    //59
    "Commercial Land",
    "Double T Ranch",
    "Falcon Crest",
    "Farm Springs",
    "Monviso",
    "Other(Areas 23-41)",
    "Parleys Park",
    "Sage Creek at Moab",
    "Two Bears Ranch",
    "Utah Area",
    "Vista Valley",
    "Zion Mountain Ranch",
    //60
    "Anchor",
    "Canyon Trails",
    "Chamera",
    "Commercial Land",
    "Deer Hollow Village",
    "Les Maisons Du Soleil",
    "National Area",
    "None",
    "Samaria",
    "Unassigned",
    "Whisper Ridge",
    //61
    "Commercial Land",
    "International Area",
    "Stann Creek District",
  ];
  es: any;
  redirect = false;
  hideheader: boolean;
  readonly: boolean;
  property_id_popup;
  chart_title;
  sqr_ft;
  hiddenOmp = true;
  offMarketHomes = [];
  ompCount = 0;
  singleOmp: any;
  Recommendation: string;
  It_is_not_recommended: string;
  newclient_id: any;

  constructor(
    private sharedMlsService: SharedMlsService,
    public translate: TranslateService,
    public paymentService: PaymentService,
    public statusService: StatusService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private api: ChartService,
    private dataService: DataService,
    public dialog: MatDialog,
    private router: Router,
    private timerService: TimerService
  ) {
    this.currentId = JSON.parse(localStorage.getItem("currentUser"))._id;
    //console.log(this.currentId);
  }

  ngOnInit() {
    this.get_user_info();

    // console.log(this.maximumDate);
    let month: any = this.maximumDate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }

    let date: any = this.maximumDate.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    let year = this.maximumDate.getFullYear();

    this.max_date = month + "/" + date + "/" + year;

    this.get_api_type();
    //this.getProperties();
    // console.log(localStorage.getItem('chart_title'));

    this.validateChartForm();
    this.getMlsDetails();

    //console.log(this.isLeftVisible);
    this.route.params.subscribe((res) => {
      console.log(res);
      if (res.id == "prospecting" || res.id == "new_client") {
        this.isLeftVisible = true;
        this.hiddenOmp = true;
        //console.log(this.isLeftVisible);
        if (res.id == "new_client") {
          this.property_id_popup = res.redirect;
          this.newclient_id = res.sqft;
          //console.log(this.newclient_id);
        }
        if (res.id == "prospecting") {
          this.chart_title = decodeURIComponent(res.redirect);
          this.sqr_ft = res.sqft;
        }
        //this.getProperties();
      } else {
        this.Id = res.id;
        //console.log(this.Id);
      }

      //this.getProperties();
      if (res.id == "redirectBackToAnalysis") {
        this.hideheader = true;
        var listing_type = localStorage.getItem("analysis_type");
        //console.log(listing_type);
        this.addChart.controls.listing_type.setValue(listing_type);
        this.readonly = true;

        if (res.redirect == "prospecting" || res.redirect == "new_client") {
          if (res.redirect == "new_client") {
            this.property_id_popup = res.sqft;
            this.newclient_id = res.title;
          }
          if (res.redirect == "prospecting") {
            this.chart_title = decodeURIComponent(res.sqft);
            this.sqr_ft = res.title;
          }
          //this.getProperties();
        }
        //console.log(this.hideheader);
      }

      if (res.redirect == "redirectBackToAnalysis") {
        this.redirect = true;
        //console.log('qwdqwd');
      }
      this.getProperties();
    });

    this.es = {
      firstDayOfWeek: 0,
      dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "Today",
      clear: "Clear",
    };
  }

  get_user_info() {
    this.api.get_user_info().subscribe(
      (dataResponse) => {
        //console.log(dataResponse);

        dataResponse.data.roles.forEach((item) => {
          if (item.role == "member") {
            item.association.forEach((item1) => {
              if (item1.mls_id == localStorage.getItem("f_mls")) {
                //console.log(item1.payer_type_online.toLowerCase());

                if (item1.payer_type_online != null) {
                  if (
                    item1.payer_type_online.toLowerCase() != "offline" &&
                    item1.payer_type_online.toLowerCase() != "false"
                  ) {
                    this.api
                      .get_user_subscriptions({
                        f_mls: localStorage.getItem("f_mls"),
                      })
                      .subscribe(
                        (dataResponsesub) => {
                          //console.log(dataResponsesub);
                          if (dataResponsesub.payments) {
                            //console.log(dataResponse.payments.subscription_end_date);
                            if (
                              dataResponsesub.payments.subscription_end_date <
                              Date.now() / 1000
                            ) {
                              //console.log('payment');
                              this.router.navigate(["/payment"]);
                            }
                          } else {
                            this.router.navigate(["/payment"]);
                          }
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                  }
                }
              }
            });
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get_subdivisions(filter = null) {
    this.loadersub = true;
    var body = {
      mls: localStorage.getItem("f_mls"),
      filter: filter,
    };
    if (this.request) {
      this.request.unsubscribe();
    }
    this.Subs = [];
    this.request = this.dataService.get_subdivisions(body).subscribe(
      (response) => {
        const count = response.length;
        //console.log(count);
        this.Subs = [];
        response.forEach((element) => {
          this.Subs.push(element.name);
        });
        //console.log(this.Subs);
        if (count == this.Subs.length) {
          this.loadersub = false;
        }
      },
      (error) => {
        this.loadersub = false;
        console.log(error);
      }
    );
  }

  get_pcbor_subs(area) {
    var index = null;
    this.loadersub = true;
    this.Subs = [];
    for (var x = 0; x < this.pcborAreas.length; x++) {
      if (area === this.pcborAreas[x]) {
        index = x;
      } else {
        //console.log("Continue...")
      }
    }

    switch (index) {
      case 0:
        this.Subs = this.pcborSubs;
        break;
      case 1:
        this.Subs = [
          "205 Main St. Condominiums",
          "310 Marsac Place",
          "All Seasons",
          "Alpenhof",
          "Alpine Retreat",
          "Alpine Shadows",
          "Aspen Grove",
          "Blue Church Lodge",
          "Bonanza Flats",
          "Caledonian",
          "Canyon View",
          "Caribou Lodge",
          "Claimjumper",
          "Coalition Lodge",
          "Columbine",
          "Commercial Land",
          "Copper Bottom Inn",
          "Cottages on the Park",
          "Craigs",
          "Crescent Ridge",
          "Daly Avenue (255 Daly Avenue)",
          "Daly Avenue Twin Homes",
          "Daly Condominiums (141 Daly Condominiums)",
          "Daly Doubles",
          "Daly West",
          "Double Jack",
          "Echo Spur",
          "Edelweiss Haus",
          "Empire Canyon",
          "Empire Coalition",
          "Empire House",
          "Fashion Coalition",
          "Fisher",
          "Four Aces",
          "Fourteenth St Townhouse",
          "Foxglove Cottages",
          "Funks Place",
          "Galleria",
          "Gambler",
          "Greyhawk",
          "Hearthstone",
          "Heber Avenue Condominiums",
          "Homestake",
          "Hotel Park City",
          "Hunter Villa",
          "Interline",
          "Jefferson House",
          "John Doyle House",
          "Jupiter Peak Lodge",
          "King Road Subdivision",
          "Kings Crown",
          "La Casa Grande",
          "Lift Line",
          "Lift Lodge",
          "Marriott Mountainside",
          "Marriott Summit Watch",
          "Marsac Mill Manor",
          "Marsac Place",
          "Millsite Reservation",
          "Mine Camp",
          "Moose Lodge At Park City",
          "Motherlode",
          "Mountain Wood",
          "Norfolk Lode",
          "North Star",
          "Northridge",
          "Old Town Area",
          "Olive Branch",
          "Ontario Avenue (253 Ontario Avenue)",
          "Ontario Avenue Subdivision",
          "Park Avenue",
          "Park Avenue (820 Park Avenue)",
          "Park Avenue Commercial",
          "Park Avenue Condominiums",
          "Park City Survey",
          "Park City Village",
          "Park Hotel",
          "Park Palace",
          "Park Place",
          "Park Station",
          "Parkside Ski Condominiums",
          "Parkwood",
          "Parkwood Place",
          "Payday",
          "Pearl West",
          "Pinion Pine",
          "Poison Creek Mercantile",
          "Portico",
          "Potters Corner",
          "Powder Keg",
          "Powder Pointe",
          "Powder Ridge",
          "Quakie",
          "Quicksilver",
          "Quittin Time",
          "Rectories",
          "Resort Center",
          "Resort Townhomes",
          "Retreat at the Park",
          "Roundabout",
          "Settlers Ridge",
          "Shadow Ridge",
          "Shaft",
          "Silver Cliff Village",
          "Silver King",
          "Silver Mill House",
          "Silver Mine West",
          "Silver Pointe",
          "Silver Queen",
          "Silver Skis",
          "Silver Star - Spiro Condominiums",
          "Silver Star - The Cottages",
          "Silverbell",
          "Silvertown",
          "Ski Team",
          "Skiers Lodge",
          "Sky Lodge",
          "Sky Silver",
          "Sky Strada",
          "Snow Blaze/Wildwood",
          "Snow Country",
          "Snow Flower",
          "Snow Haven",
          "Snow Park Subdivision",
          "Snowcrest",
          "Snyders Addition",
          "Struggler",
          "Sunflower",
          "Sunnyside",
          "Sunnyside Up",
          "Sunspot",
          "Sweetwater",
          "Temptation",
          "The Gables",
          "The Line Condominiums",
          "The Lofts on Deer Valley Drive",
          "The Lowell",
          "The Parkite",
          "Three Kings",
          "Town Lift",
          "Town Pointe",
          "Townhome (587 Townhome)",
          "Treasure Mountain Inn",
          "Upper Norfolk Avenue Condominiums",
          "Victorian Village",
          "Village Loft",
          "Walk to Slopes",
          "Wasatch",
          "Washington Mill",
          "Woodside Chalet",
          "Yellow Slicker",
        ];
        break;
      case 2:
        this.Subs = [
          "Aspen Springs Ranch",
          "Commercial Land",
          "Iron Canyon",
          "Thaynes Canyon",
          "Thaynes Canyon Area",
          "Thaynes Creek Ranch",
        ];
        break;
      case 3:
        this.Subs = [
          "Aspen Wood",
          "Black Diamond Lodge",
          "Boulder Creek",
          "Bristlecone",
          "Chaparral",
          "Chateau Fawngrove",
          "Commercial Land",
          "Comstock Lodge",
          "Courchevel",
          "Daystar/Amber Daystar",
          "Deer Lake Village",
          "Deer Valley North Parcel",
          "Fawngrove",
          "Glenfiddich",
          "Hidden Meadows",
          "Hidden Oaks",
          "In the Trees",
          "La Maconnerie",
          "Lakeside",
          "Lodges At Deer Valley",
          "Lower Deer Valley Area",
          "Morning Star Estates",
          "Nordic Village",
          "Pine Inn",
          "Pinnacle",
          "Powder Run",
          "Queen Esther Village",
          "Red Stag Lodge",
          "Royal Oaks",
          "Silver Baron",
          "Solamere",
          "Stonebridge",
          "The Oaks At Deer Valley",
          "Trails End At Deer Valley",
          "Trails End Lodge",
          "Wildflower - Deer Valley",
        ];
        break;
      case 4:
        this.Subs = [
          "Commercial Land",
          "Deer Creek Estates",
          "Deer Creek Townhomes",
          "Deer Crest Area",
          "Deer Crest Estates",
          "Deer Crest Village",
          "Deer Pointe",
          "Hidden Hollow",
          "Snow Top",
          "St. Regis",
        ];
        break;
      case 5:
        this.Subs = [
          "Alpen Rose",
          "Alta Vista",
          "American Flag",
          "Aspen Hollow",
          "Bald Eagle Club",
          "Bellearbor",
          "Bellemont",
          "Belleterre",
          "Bellevue",
          "Black Bear Lodge",
          "Cache At Silver Lake",
          "Chateaux At Silver Lake",
          "Commercial Land",
          "Deer Valley Club",
          "Double Eagle",
          "Enclave",
          "Evergreen",
          "Goldener Hirsch",
          "Knoll At Silver Lake",
          "Knoll Estates/Deer Valley Club Estates",
          "Knollheim",
          "Little Belle",
          "Lookout At Deer Valley",
          "Mont Cervin",
          "Ontario Lodge",
          "Ridge",
          "Ridgepoint",
          "Royal Plaza",
          "Silver Bird",
          "Silver Lake Village",
          "Stag Lodge",
          "Stein Eriksen Lodge",
          "Stein Eriksen Residences",
          "Sterling Lodge",
          "Sterlingwood",
          "The Cottages",
          "The Inn At Silver Lake",
          "The Residences At the Chateaux",
          "Trailside",
          "Twin Pines At Silver Lake",
          "Upper Deer Valley Area",
          "Woods At Deer Valley",
        ];
        break;
      case 6:
        this.Subs = [
          "Arrowleaf",
          "Bannerwood",
          "Commercial Land",
          "Empire Residences",
          "Flagstaff",
          "Grand Lodge",
          "Ironwood",
          "Larkspur",
          "Montage Deer Valley",
          "Nakoma",
          "Northside Village",
          "One Empire Pass",
          "Paintbrush",
          "Red Cloud",
          "Shooting Star",
          "Silver Cloud",
          "Silver Strike Lodge Condominium",
          "The Belles at Empire Pass",
        ];
        break;
      case 7:
        this.Subs = [
          "Aerie Area",
          "April Mountain",
          "Commercial Land",
          "Overlook",
        ];
        break;
      case 8:
        this.Subs = [
          "Canyon Crossing",
          "Carriage House",
          "Chatham Crossing/Fenchurch",
          "Chatham Hills",
          "Commercial Land",
          "Fireside",
          "Iron Horse",
          "Iron Horse Industrial",
          "Ironhorse Park Commercial",
          "New Claim",
          "Park City Heights",
          "Park Plaza",
          "Park Regency",
          "Prospector Area",
          "Prospector Park",
          "Prospector Square Condos",
          "Prospector Square Subdivision (PSA)",
          "Prospector Village",
          "Sun Creek",
        ];
        break;
      case 9:
        this.Subs = [
          "Boothill Condos at Park Meadows",
          "Broken Spoke",
          "Commercial Land",
          "Cove At Eagle Mountain",
          "Eagle Pointe",
          "Fairway Hills",
          "Fairway Meadows",
          "Fairway Village",
          "Finnegans Bluff",
          "Four Lakes Village",
          "Gleneagles",
          "Holiday Ranchettes",
          "Jupiter Inn",
          "Lakeview Cottages",
          "Last Sun At the Cove",
          "Mcleod Creek",
          "Meadows Estates",
          "Mountain Ridge",
          "Mountain Top",
          "Park Meadows",
          "Parkview",
          "Racquet Club",
          "Ridgeview",
          "Ridgeview Townhomes",
          "Risner Ridge",
          "Saddle",
          "Sandstone Cove",
          "Sunny Slopes in Park Meadows",
          "The Gallery at The Cove at Eagle Mountain",
          "West Ridge",
          "Willow Ranch",
          "Windrift",
        ];
        break;
      case 10:
        this.Subs = [
          "Apex Residences",
          "Aspen Creek Crossing",
          "Blackstone Residences",
          "Canyon Residences",
          "Club Regent",
          "Colony At White Pine Canyon",
          "Commercial Land",
          "Dutch Draw At Canyon Estates",
          "Eagles Dance",
          "Fairway Springs Ski and Golf Villas Condominiums",
          "Frostwood Villas",
          "Grand Summit Hotel",
          "Hidden Creek",
          "Hyatt Centric Park City",
          "Juniper Landing",
          "Lift Condominiums",
          "Lodge at Westgate",
          "Park West Village",
          "Park West/Hidden Creek",
          "Pendry Residences Park City",
          "Red Pine",
          "Silverado Lodge",
          "Sundial Lodge",
          "Sunrise At Escala",
          "The Canyons Area",
          "The Miners Club",
          "The Ridge at Canyons Village",
          "Timber Wolf Lodges",
          "Timberwolf Estates",
          "Village Round",
          "Vintage on the Strand",
          "Viridian Townhomes",
          "Waldorf Astoria",
          "White Pine Canyon",
          "White Pine Canyon Village",
          "White Pine Lodges",
          "White Pine Ranches",
          "YOTELPAD Condominiums",
        ];
        break;
      case 11:
        this.Subs = [
          "Bear Hollow Ridge",
          "Bear Hollow Village",
          "Cedar Draw",
          "Cedar Draw Estates",
          "Commercial Land",
          "Enclave At Cedar Draw",
          "Enclave At Sun Canyon",
          "Lodges At Bear Hollow Village",
          "Mahogany Hills",
          "Sun Peak",
          "The Cove At Sun Peak/Winter Park",
          "Willow Draw Cottages",
        ];
        break;
      case 12:
        this.Subs = [
          "Commercial Land",
          "Meadow Springs",
          "Meadow Wild",
          "Northshore",
          "Ptarmigan",
          "Quail Meadows",
          "Ranch Place",
          "Silver Meadows",
          "Silver Springs",
          "Snyders Mill",
          "Southshore",
          "Willow Bend East/Silver Springs Townhomes",
          "Willow Bend West",
        ];
        break;
      case 13:
        this.Subs = [
          "Brookside Estates",
          "Brookside Estates on Two Creeks Lane",
          "Commercial Land",
          "Creek Ranch Estates",
          "Gt Flinders",
          "Juddabeth",
          "Old Ranch Road Area",
          "Quarry Mountain Ranch",
          "Ranch Creek",
          "Shadow Mountain",
          "Treasure Mountain Estates",
          "Two Creeks",
          "Willow Creek Estates",
        ];
        break;
      case 14:
        this.Subs = [
          "Blackhawk Station",
          "Canyon Creek",
          "Commercial Land",
          "Crestview Condos",
          "Fiddich Glen",
          "Fox Point At Redstone",
          "Kimball Junction Area",
          "Nevis at Newpark",
          "Newpark Hotel",
          "Newpark Resort Residences",
          "Newpark Terrace",
          "Park City RV Resort",
          "Powder Mountain",
          "Powderwood",
          "Spring Creek",
          "Trout Creek",
        ];
        break;
      case 15:
        this.Subs = [
          "Boothill",
          "Brook Hollow Village",
          "Cedar Ridge",
          "Commercial Land",
          "Courtyards At Quarry Village",
          "Discovery Ridge",
          "Eagle Ridge",
          "Ecker Hill",
          "Ecker Village",
          "Elk Run",
          "High Meadows At Pinebrook",
          "Horsethief Canyon",
          "Kilby Road",
          "Pine Creek",
          "Pinebrook",
          "Pinebrook Cottages",
          "Pinebrook Pointe",
          "Pineridge",
          "Quarry Springs",
          "Ranch Condominiums",
          "Sunridge",
        ];
        break;
      case 16:
        this.Subs = [
          "Aspenbrook",
          "Commercial Land",
          "Summit Park",
          "Summit Park Area",
          "Timberline",
        ];
        break;
      case 17:
        this.Subs = [
          "Back Nine",
          "Canyon Links",
          "Circle J Club",
          "Commercial Land",
          "Creek View Estates",
          "Hidden Cove",
          "Jeremy Cove",
          "Jeremy Point - Viewpoint",
          "Jeremy Point Golf Villas",
          "Jeremy Ranch Area",
          "Jeremy Ranch Club",
          "Jeremy Woods",
          "Kilby - North of I-80",
          "Kilby On Parleys Lane",
          "Moose Hollow",
          "Overlook at Jeremy Ranch",
          "SkyRidge",
          "South Ridge",
          "Sunrise Hills",
          "The Trails at Jeremy Ranch",
          "The Woods of Parley's Lane",
          "Viewpointe",
          "Wildflower - Jeremy",
        ];
        break;
      case 18:
        this.Subs = [
          "Glenwild",
          "Goshawk Ranch",
          "Knob Hill",
          "Ranches At the Preserve",
          "Stagecoach Estates",
          "The Preserve",
        ];
        break;
      case 19:
        this.Subs = [
          "Aspen Ridge Ranch",
          "Blackhawk Ranch",
          "Commercial Land",
          "East Creek Ranch",
          "Greenfield Ranches",
          "Majestic Mountain",
          "Red Hawk",
          "Silver Creek",
        ];
        break;
      case 20:
        this.Subs = [
          "Commercial Land",
          "Highland Estates",
          "Mountain Ranch Estates",
          "Park Ridge Estates",
          "Round Valley Ranches",
          "Sagebrook",
          "Silver Summit",
          "Sun Meadow",
          "Trailside Park",
        ];
        break;
      case 21:
        this.Subs = [
          "Commercial Land",
          "Silver Creek Village",
          "Silver Gate Ranches",
          "The Village Park City",
        ];
        break;
      case 22:
        this.Subs = [
          "Aspen Camp",
          "Bison Bluffs",
          "Buffalo Jump",
          "Deer Crossing",
          "Dye Course Cabins",
          "Elk Ridge Heights",
          "Golf Club Cabins",
          "Lookout Ridge",
          "Nicklaus Private Estates At Painted Shores",
          "Nicklaus Residences",
          "Nicklaus Villas",
          "Northgate Canyon",
          "Painted Sky",
          "Promontory",
          "Promontory Area",
          "Promontory Ridge",
          "Ranch Club Cabins",
          "Range Hill",
          "Signal Hill",
          "Silver Gate Ranches",
          "Sunset Ridge",
          "The Homesteads",
          "The Palisades",
          "The Summit",
          "Trapper's Cabins",
          "Wapiti Canyon",
          "West Hills",
          "West View",
        ];
        break;
      case 23:
        this.Subs = ["Commercial Land", "Olpin Mort and Greater PC"];
        break;
      case 24:
        this.Subs = [
          "Fox Bay",
          "Hailstone",
          "Jordanelle Village",
          "Lodge At Stillwater",
          "Shoreline Village",
          "Shores at Stillwater",
          "SkyRidge",
          "Star Harbour Estates",
          "The Views at Stillwater",
          "Village at the Shores",
          "Village at the Shores - Cedar Edition",
          "Village at the Shores - Oak Edition",
        ];
        break;
      case 25:
        this.Subs = [
          "Black Rock Ridge",
          "Deer Mountain",
          "Deer Mountain-Keetley Station",
          "Deer Mountain-Ross Creek",
          "Deer Vista",
          "East Park",
          "Gardner Addition",
          "Park East",
          "Park's Edge",
          "The Retreat At Jordanelle",
          "Wasatch Springs",
        ];
        break;
      case 26:
        this.Subs = [
          "Forevermore Estates",
          "Glistening Ridge",
          "Golden Eagle",
          "Hideout Canyon",
          "Hideout City (not Canyon)",
          "Klaim",
          "Overlook Village",
          "Reflection Ridge",
          "Rustler at Hideout Canyon",
          "Silver Sky",
          "Silver Strike Subdivision",
          "Soaring Hawk at Hideout",
          "Tuhaye",
        ];
        break;
      case 27:
        this.Subs = ["None", "River View", "Talisman", "Victory Ranch"];
        break;
      case 28:
        this.Subs = [];
        break;
      case 29:
        this.Subs = [];
        break;
      case 30:
        this.Subs = [
          "Appenzell",
          "Aspen Park No. 1",
          "Brighton Estates",
          "Burgi Hill Ranches",
          "Cascades at Soldier Hollow",
          "Commercial Land",
          "Cottage Creek",
          "Cottages At Canyon View",
          "Cottages on the Green",
          "Creek Place",
          "Deer Ridge Estates",
          "Dutch Fields",
          "Farms At Tate Lane",
          "Fox Den Estates",
          "Fox Pointe",
          "Interlaken",
          "K & J",
          "Lacy Lane Estates",
          "Lime Canyon Estates",
          "Lodges At Snake Creek",
          "Matterhorn",
          "Meadow Creek Estates - Midway",
          "Midway",
          "Midway Valley Estates",
          "Midway Village",
          "Montresee",
          "Mountain Springs",
          "Oak Haven",
          "Pine Canyon",
          "River Meadows Ranch",
          "Scotch Fields",
          "Sunburst Ranch",
          "Swiss Alpenhof",
          "Swiss Creek Chalets",
          "Swiss Farm",
          "Swiss Mountain Estates",
          "Swiss Oaks",
          "Swiss Paradise",
          "The Farm At Deer Meadow",
          "The Hamlet",
          "The Links At the Homestead",
          "Turnberry",
          "Turnberry Woods",
          "Valais",
          "Village on the Green",
          "Wintergreen",
          "Wintergreen-Grindelwald",
          "Winterton Farms",
          "Zermatt Villas",
        ];
        break;
      case 31:
        this.Subs = ["North Fields"];
        break;
      case 32:
        this.Subs = [
          "The Cove at Valley Hills",
          "The Cove Estates",
          "Valley Heights",
          "Valley Hills",
          "Wasatch View",
        ];
        break;
      case 33:
        this.Subs = ["Red Ledges"];
        break;
      case 34:
        this.Subs = [];
        break;
      case 35:
        this.Subs = [
          "Alpine Acres",
          "Aspen Pointe",
          "Autumn Meadows",
          "Country Meadow Estates",
        ];
        break;
      case 36:
        this.Subs = [
          "Alpine Acres",
          "Broadhead Estates",
          "Cottages at Valley Station",
          "Harvest Fields",
          "Hat Creek",
          "Heber and Daniels Area",
          "Heber City",
          "Mill Road Estates",
          "Mountain View Estates",
          "Muirfield",
          "Old Mill Estates",
          "Timp Meadows",
          "Timpview Acres",
          "Triple Crown",
          "Wheeler Park",
        ];
        break;
      case 37:
        this.Subs = [
          "Beaufontaine",
          "Big Pole Estates",
          "Cobblestone",
          "Commercial Land",
          "Cottonwoods At Lake Creek",
          "Crossings At Lake Creek",
          "Greenerhills",
          "Lake Creek",
          "Lake Creek Farms",
          "Sage Creek Farms-Heber",
          "Stonebridge Farms",
          "Ucanogos",
          "Wild Mare",
        ];
        break;
      case 38:
        this.Subs = ["Commercial Land", "Timberlakes Area"];
        break;
      case 39:
        this.Subs = [];
        break;
      case 40:
        this.Subs = ["Storm Haven"];
        break;
      case 41:
        this.Subs = [
          "Commercial Land",
          "Daniel",
          "Daniel Ranches",
          "Daniels Estates",
          "Daniels Gate",
          "Daniels Summit",
        ];
        break;
      case 42:
        this.Subs = ["Charleston", "Charleston Estates", "Winterton Farms"];
        break;
      case 43:
        this.Subs = ["Commercial Land", "Slipper Hollow Ranch", "Wallsburg"];
        break;
      case 44:
        this.Subs = [];
        break;
      case 45:
        this.Subs = [];
        break;
      case 46:
        this.Subs = [
          "Canyon Meadows",
          "Commercial Land",
          "Creek Hollow Estates",
          "Mandan Cottages",
          "Provo Canyon Area",
          "River Run Cottages",
          "Stewart Cascades",
          "Sundance",
          "Timphaven",
        ];
        break;
      case 47:
        this.Subs = [];
        break;
      case 48:
        this.Subs = [
          "Closed Outdated",
          "Commercial Land",
          "Wasatch County Area",
        ];
        break;
      case 49:
        this.Subs = [];
        break;
      case 50:
        this.Subs = [
          "Commercial Land",
          "Coonradt",
          "Diamond Bar X",
          "Elk Meadows",
          "Francis",
          "Francis Acres",
          "Kirkham Estates",
          "River Bluffs",
          "Rock Cliff Ranches",
          "Summit Haven",
          "The Bluffs",
          "Uinta Shadows",
          "Uinta Willows",
          "Wild Willow",
          "Wolf Creek Ranch",
          "Woodland and Francis Area",
          "Woodland Estates",
          "Woodland Hills",
          "Woodland Park",
        ];
        break;
      case 51:
        this.Subs = [
          "B and L",
          "Beaver Creek at Kamas",
          "Beaver Creek Estates",
          "Canyon Creek",
          "Canyon Creek Kamas",
          "Commercial Land",
          "Foothill Estates",
          "Garff Ranches",
          "Grassy Creek",
          "High Star Ranch",
          "Kamas and Marion Area",
          "Kamas Commons",
          "Kamas East",
          "Kamas East-Svr",
          "Marion",
          "Marion Meadows",
          "Meadowview",
          "Pine Plateau Estates",
          "Ranch Cabin Subdivision at High Star Ranch",
          "Sage Creek Farms-Kamas",
          "Samak Acres",
          "Samak Estates",
          "Samak Hills",
          "Samak Park",
          "Spring Meadows",
          "The Village at Lambert Lane",
          "Uinta View Condominiums",
          "Wakefield",
          "Webster Estates",
          "Willow Brook",
        ];
        break;
      case 52:
        this.Subs = [
          "Aspen Acres",
          "Aspen Mountain",
          "Beaver Springs",
          "Canyon Rim Ranch",
          "Commercial Land",
          "Deer Haven",
          "Elder Acres",
          "Franson Estates",
          "Gilbert Meadows",
          "Hidden Lakes",
          "Horse Hollow Ranch",
          "Hylander Horse Haven",
          "Maple Ridge Ranches",
          "Mountain Valley Ranches",
          "North Bench Farms",
          "Oakley",
          "Oakley Bench Estates",
          "Oakley Meadows",
          "Pine Mountain",
          "Pioneer Shadow",
          "River Ridge Estates",
          "Rockin-A-Estates",
          "Snapp-South Field",
          "Weber Canyon",
          "Weber Meadowview",
          "Weber Wild",
          "Wilderness Acres",
        ];
        break;
      case 53:
        this.Subs = [
          "Brown's Canyon",
          "Commercial Land",
          "Elk Ridge",
          "Peoa and Browns Canyon Ar",
        ];
        break;
      case 54:
        this.Subs = [
          "Beacon Hill II (2)",
          "Bradbury Canyon",
          "Bridge Hollow",
          "Chalk Creek",
          "Coalville",
          "Commercial Land",
          "Cottonwood Acres",
          "Echo",
          "Echo Creek Ranches",
          "Forest Meadows",
          "Fox Run",
          "Franklin Canyon",
          "Grass Creek Estates",
          "Henefer",
          "Hoytsville",
          "Indian Hills",
          "Lake View Estates",
          "Mt Lewis Ranches",
          "North Summit",
          "Pine Meadows",
          "Ranches",
          "Rockport",
          "Rockport Estates",
          "Rockport Ranches",
          "Sorrel Ridge",
          "Tollgate",
          "Tollgate – Unassigned",
          "Walker View Estates",
          "Wan.- Hoyt - Coal.- Rock.",
        ];
        break;
      case 55:
        this.Subs = [];
        break;
      case 56:
        this.Subs = ["Commercial Land", "Morgan Co - Henefer and Echo Ar."];
        break;
      case 57:
        this.Subs = [
          "Commercial Land",
          "Durfee Creek",
          "Eagle Ridge Cluster",
          "Eden",
          "Elkhorn At Wolf Creek Resort",
          "Huntsville/Snowbasin Area",
          "North Fork Meadows",
          "Powder Mountain",
          "Reserve At Crimson Ridge",
          "Sanctuary Utah",
          "Snowbasin",
          "The Fairways",
          "The Highlands At Wolf Creek Resort",
          "The Ridge Townhomes",
          "Trapper's Ridge",
          "Wolf Lodge",
          "Wolf Star",
        ];
        break;
      case 58:
        this.Subs = [
          "American Towers",
          "Cliff Club",
          "Commercial Land",
          "Eastwood Hills",
          "Emigration Canyon",
          "Highpoint",
          "Iron Blossom Lodge",
          "Superior Lodge",
          "Wasatch Front Ar 38",
        ];
        break;
      case 59:
        this.Subs = [
          "Commercial Land",
          "Double T Ranch",
          "Falcon Crest",
          "Farm Springs",
          "Monviso",
          "Other(Areas 23-41)",
          "Parleys Park",
          "Sage Creek at Moab",
          "Two Bears Ranch",
          "Utah Area",
          "Vista Valley",
          "Zion Mountain Ranch",
        ];
        break;
      case 60:
        this.Subs = [
          "Anchor",
          "Canyon Trails",
          "Chamera",
          "Commercial Land",
          "Deer Hollow Village",
          "Les Maisons Du Soleil",
          "National Area",
          "None",
          "Samaria",
          "Unassigned",
          "Whisper Ridge",
        ];
        break;
      case 61:
        this.Subs = [
          "Commercial Land",
          "International Area",
          "Stann Creek District",
        ];
        break;
      default:
        console.log("No Area Found");
    }
    this.loadersub = false;
  }

  get_zips(filter = null) {
    this.loaderzip = true;
    var body = {
      mls: localStorage.getItem("f_mls"),
      filter: filter,
    };
    if (this.request2) {
      this.request2.unsubscribe();
    }
    this.Zips = [];
    this.request2 = this.dataService.get_zips(body).subscribe(
      (response) => {
        response.forEach((element) => {
          this.Zips.push(element.name);
        });
        this.loaderzip = false;
      },
      (error) => {
        console.log(error);
        this.loaderzip = false;
      }
    );
  }

  get_chart_details(Id) {
    let body = {
      id: Id,
    };

    this.loader = true;
    this.api.get_chart_details_only(body).subscribe(
      (dataResponse) => {
        //console.log(dataResponse.data.offMarketHomes);
        //return
        console.log(dataResponse.data);
        var chart_title = dataResponse.data.chart_title;
        var property_id = dataResponse.data.property_id;
        var squareFootage = dataResponse.data.targetProperty.squareFootage;
        var maxArea = dataResponse.data.relatedProperty.maxArea;
        var maxPrice = dataResponse.data.relatedProperty.maxPrice;
        var maxYear = dataResponse.data.relatedProperty.maxYear;
        var minArea = dataResponse.data.relatedProperty.minArea;
        var minClose = dataResponse.data.relatedProperty.minClose;
        var minPrice = dataResponse.data.relatedProperty.minPrice;
        var minYear = dataResponse.data.relatedProperty.minYear;
        var propertySubType = dataResponse.data.relatedProperty.propertySubType;
        var pcborPropType = dataResponse.data.relatedProperty.pcborPropType;
        var listing_type = dataResponse.data.relatedProperty.listing_type;
        var furnished = dataResponse.data.relatedProperty.furnished;
        var areaArray = dataResponse.data.relatedProperty.areaArray;
        var subDivisionArray =
          dataResponse.data.relatedProperty.subDivisionArray;
        var zipCodeArray = dataResponse.data.relatedProperty.zipCodeArray;
        var waterFront = dataResponse.data.relatedProperty.wf;
        var folioNumber = dataResponse.data.relatedProperty.folionumber;
        var privatePool = dataResponse.data.relatedProperty.pool;
        var hoa = dataResponse.data.relatedProperty.hoa;
        var hopa = dataResponse.data.relatedProperty.hopa;
        localStorage.setItem("f_mls", dataResponse.data.relatedProperty.mls_id);
        this.addChart.controls.chart_title.setValue(chart_title);
        //console.log(dataResponse.data.offMarketHomes);
        this.offMarketHomes = dataResponse.data.offMarketHomes;
        this.ompCount = this.offMarketHomes.length;
        /* console.log(this.offMarketHomes);
      return; */
        this.callomp = true;
        if (property_id) {
          this.api.get_property(property_id).subscribe((dataResponse) => {
            //console.log(dataResponse.data);
            this.onGroup(dataResponse.data);
          });
        }

        if (dataResponse.data.client.client_id) {
          this.newclient_id = dataResponse.data.client.client_id;
        }

        /* this.properties.forEach(element => {

        if (property_id == element._id) {
          console.log(element);
          this.onGroup(element);
        }
      }); */

        if (!property_id) {
          this.addChart.controls.sqr_ft.setValue(squareFootage);
          //this.showft1 = false;
          this.showft = true;
        }

        //console.log("List: " + listing_type);

        this.addChart.controls.property_type.setValue(propertySubType);
        this.addChart.controls.pcbor_prop_type.setValue(pcborPropType);
        this.addChart.controls.listing_type.setValue(listing_type);
        this.addChart.controls.furnished.setValue(furnished);
        this.addChart.controls.min_year.setValue(minYear);
        this.addChart.controls.max_year.setValue(maxYear);
        this.addChart.controls.min_price.setValue(minPrice);
        this.addChart.controls.max_price.setValue(maxPrice);
        this.addChart.controls.min_square_footage.setValue(minArea);
        this.addChart.controls.max_square_footage.setValue(maxArea);
        this.addChart.controls.waterfront.setValue(waterFront);
        this.addChart.controls.private_pool.setValue(privatePool);
        this.addChart.controls.hopa.setValue(hopa);
        this.addChart.controls.hoa.setValue(hoa);
        this.addChart.controls.folionumber.setValue(folioNumber);
        this.zipCode = zipCodeArray;
        this.areas = areaArray;
        //console.log(subDivisionArray);
        this.subDivisions = subDivisionArray;
        //console.log(this.subDivisions);
        this.addChart.controls.min_date.setValue(new Date(minClose));

        this.loader = false;
      },
      (error) => {
        //console.log(error.data);
        if (error.data) {
          var dataResponse = error;
          var chart_title = dataResponse.data.chart_title;
          var property_id = dataResponse.data.property_id;
          var squareFootage = dataResponse.data.targetProperty.squareFootage;
          var maxArea = dataResponse.data.relatedProperty.maxArea;
          var maxPrice = dataResponse.data.relatedProperty.maxPrice;
          var maxYear = dataResponse.data.relatedProperty.maxYear;
          var minArea = dataResponse.data.relatedProperty.minArea;
          var minClose = dataResponse.data.relatedProperty.minClose;
          var minPrice = dataResponse.data.relatedProperty.minPrice;
          var minYear = dataResponse.data.relatedProperty.minYear;
          var propertySubType =
            dataResponse.data.relatedProperty.propertySubType;
          var pcborPropType = dataResponse.data.relatedProperty.pcborPropType;
          var areaArray = dataResponse.data.relatedProperty.areaArray;
          var subDivisionArray =
            dataResponse.data.relatedProperty.subDivisionArray;
          var zipCodeArray = dataResponse.data.relatedProperty.zipCodeArray;
          var waterFront = dataResponse.data.relatedProperty.wf;
          var folioNumber = dataResponse.data.relatedProperty.folionumber;
          var privatePool = dataResponse.data.relatedProperty.pool;
          var hoa = dataResponse.data.relatedProperty.hoa;
          var hopa = dataResponse.data.relatedProperty.hopa;
          this.addChart.controls.chart_title.setValue(chart_title);
          //console.log(this.properties);

          this.properties.forEach((element) => {
            if (property_id == element._id) {
              //console.log(element);
              this.onGroup(element);
            }
          });

          if (!property_id) {
            this.addChart.controls.sqr_ft.setValue(squareFootage);
          }

          this.addChart.controls.property_type.setValue(propertySubType);
          this.addChart.controls.pcbor_prop_type.setValue(pcborPropType);
          this.addChart.controls.min_year.setValue(minYear);
          this.addChart.controls.max_year.setValue(maxYear);
          this.addChart.controls.min_price.setValue(minPrice);
          this.addChart.controls.max_price.setValue(maxPrice);
          this.addChart.controls.min_square_footage.setValue(minArea);
          this.addChart.controls.max_square_footage.setValue(maxArea);
          this.addChart.controls.waterfront.setValue(waterFront);
          this.addChart.controls.private_pool.setValue(privatePool);
          this.addChart.controls.hopa.setValue(hopa);
          this.addChart.controls.hoa.setValue(hoa);
          this.addChart.controls.folionumber.setValue(folioNumber);
          this.zipCode = zipCodeArray;
          //console.log(subDivisionArray);
          this.areas = areaArray;
          this.subDivisions = subDivisionArray;
          //console.log(this.subDivisions);
          this.addChart.controls.min_date.setValue(new Date(minClose));
        }

        this.loader = false;
      }
    );
  }

  ngAfterViewInit() {}

  /* passSearchdata(){
    console.log('in');

    let body = this.new_function();

    console.log(body);
  } */

  onGroup(label) {
    console.log(label);
    this.property_id = label._id;
    this.client_id = label.client;
    this.groupName = label.address;
    this.selectedImg = label.property_image;
    this.addChart.controls.groupName.setValue(this.groupName);
    this.showft = false;
    //this.showft1 = true;
    this.addChart.controls.sqr_ft.setValue("");
    this.addChart.controls.sqr_ft.setValidators(null);
    this.addChart.controls.sqr_ft.setErrors(null);
    this.addChart.controls.sqr_ft.updateValueAndValidity();
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    // this.translate.get('NewCharts.Select Property').subscribe((text: string) => {
    //   //console.log(text);
    //   this.groupName = text;
    //   //console.log(text);
    // });

    this.translate
      .get("NewCharts.Search Error (Data)")
      .subscribe((text: string) => {
        this.searcherrordata = text;
        //console.log(text);
      });

    this.translate
      .get("NewCharts.Search Error (Nothing found)")
      .subscribe((text: string) => {
        this.searcherrornothing = text;
      });

    this.translate.get("NewCharts.errortext").subscribe((text: string) => {
      this.searcherrordatahtml = text;
    });

    this.translate
      .get("NewCharts.errortextnothing")
      .subscribe((text: string) => {
        this.searcherrornothinghtml = text;
      });

    this.translate
      .get("Sign Out.Create Chart Error")
      .subscribe((text: string) => {
        this.CreateChartError = text;
      });

    this.translate
      .get("Sign Out.Create Chart Errortext")
      .subscribe((text: string) => {
        this.CreateChartErrortext = text;
      });

    this.translate
      .get("Sign Out.Date Range Error")
      .subscribe((text: string) => {
        this.DateRangeError = text;
      });

    this.translate
      .get("Sign Out.Date Range Errortext")
      .subscribe((text: string) => {
        this.DateRangeErrortext = text;
      });

    this.translate.get("Sign Out.Recommendation").subscribe((text: string) => {
      this.Recommendation = text;
    });

    this.translate
      .get("Sign Out.It_is_not_recommended")
      .subscribe((text: string) => {
        this.It_is_not_recommended = text;
      });

    this.translate
      .get("Sign Out.Maximum Results Exceeded")
      .subscribe((text: string) => {
        this.MaximumResultsExceeded = text;
      });

    this.translate
      .get("Sign Out.Maximum Results Exceededtext")
      .subscribe((text: string) => {
        this.MaximumResultsExceededtext = text;
      });

    this.translate
      .get("Sign Out.Minimum Results Error")
      .subscribe((text: string) => {
        this.MinimumResultsError = text;
      });

    this.translate
      .get("Sign Out.Minimum Results Errortext")
      .subscribe((text: string) => {
        this.MinimumResultsErrortext = text;
      });

    this.translate.get("NewCharts.months").subscribe((text: string) => {
      //console.log(text);
      var nameArr = text.split(",");
      //console.log(nameArr);
      this.es.monthNames = nameArr;
    });
  }

  clearPropertType() {
    console.log("clear property");

    this.addChart.controls.sqr_ft.setValidators([
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(3),
      Validators.maxLength(5),
      Validators.required,
    ]);
    this.showft = true;
    this.property_id = "";
    this.client_id = "";
    this.translate
      .get("Property.AddProperty.Select client")
      .subscribe((text: string) => {
        console.log(text);
        this.groupName = text;
        //this.CreditCardConfirmation = text;
        //console.log(text);
      });
    this.selectedImg = "";
    this.addChart.controls.groupName.setValue("");
    this.addChart.controls.sqr_ft.updateValueAndValidity();
  }

  onMapReady(map) {
    this.mapObj = map;
    //console.log(this.mapObj);
  }

  enable_polygon() {
    this.clearpolygon = true;
    this.showpolygon = false;
    if (this.clearCircle == true) {
      this.clear_circle();
    }
    this.initDrawingManager();
  }

  enable_circle() {
    this.clearCircle = true;
    this.showCircle = false;
    if (this.clearpolygon == true) {
      this.clear_polygon();
    }
    this.initRadiusManager();
  }

  clear_polygon() {
    this.showpolygon = true;
    this.clearpolygon = false;

    this.poly.setMap(null);
    this.poly = null;
    google.maps.event.clearListeners(this.mapObj, "click");
    google.maps.event.clearListeners(this.mapObj, "insert_at");
    var self = this;
    this.mapMarkers.forEach(function (el, idx) {
      self.mapMarkers[idx].setMap(null);
    });
    this.mapMarkers = this.createMarkers(this.initialPayload);
    this.selectedMarkers = this.initialPayload;
    this.homes = this.initialPayload;
    this.updateNums(this);
  }

  clear_circle() {
    this.showCircle = true;
    this.clearCircle = false;

    this.circle.setMap(null);
    this.circle = null;
    google.maps.event.clearListeners(this.mapObj, "radius_changed");
    google.maps.event.clearListeners(this.mapObj, "center_changed");
    var self = this;
    this.mapMarkers.forEach(function (el, idx) {
      self.mapMarkers[idx].setMap(null);
    });
    this.mapMarkers = this.createMarkers(this.initialPayload);
    this.selectedMarkers = this.initialPayload;
    this.homes = this.initialPayload;
    this.updateNums(this);
  }

  updateNums(self) {
    self.genChartButtonError = false;
    this.homes = [];
    //console.log(this.selectedMarkers);
    //console.log(this.initialPayload);
    self.selectedMarkers.forEach(function (sm) {
      self.initialPayload.forEach(function (ip) {
        if (ip.ListingId === sm.ListingId || ip.ListingId === sm.listingId) {
          //console.log(ip.StandardStatus)
          self.homes.push(ip);
        }
      });
    });

    var statusService = this.statusService;
    var active = this.homes.filter(function (el) {
      //console.log("Getting Actives");
      el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
      return el.StandardStatus === "Active";
    });
    var closed = this.homes.filter(function (el) {
      //console.log("Getting Closeds");
      el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
      return el.StandardStatus === "Closed";
    });
    var contingent = this.homes.filter(function (el) {
      //console.log("Getting Pendings");
      el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
      return el.StandardStatus === "Pending";
    });
    var comingSoon = this.homes.filter(function (el) {
      //console.log("Getting Pendings");
      el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
      return el.StandardStatus === "Active - Coming Soon";
    });

    this.hasSeven = closed.length < 7 ? false : true;
    this.hasThree = closed.length < 3 ? true : false;
    this.tooBig = closed.length > 100 ? true : false;
    //console.log("Updating...");
    //console.log(closed.length);
    console.log(this.centerCheck);

    this.total_count = this.homes.length;
    this.active_count = active.length + comingSoon.length;
    this.pending_count = contingent.length;
    this.cancel_count = closed.length;

    if (this.homes.length > 249 && this.centerCheck === false) {
      this.genChartButtonError = true;
    } else if (closed.length > 100 && this.centerCheck === false) {
      this.genChartButtonError = true;
    } else if (closed.length < 3 && this.centerCheck === false) {
      //console.log("Run Notice 2 Update");
      var mlsCheck = localStorage.getItem("f_mls");
      if (mlsCheck === "5d846e8de3b0d50d6ac91a2d") {
        Swal.fire({
          title: "Minimum Not Met",
          html: "Alert: You have less than the minimum number of Closed comparables required to generate a chart. Please select additional Closed comparables in order to generate a chart. We would recommend at least 5-6 additional closed comparables.",
          width: "42em",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Minimum Not Met",
          html: "This search did not return the minimum number of Closed comparables required to generate a chart. Please modify your search to expand your results. We recommend at least 7 Closed comparables to get the most accurate suggested listing price.",
          width: "42em",
          confirmButtonText: "OK",
        });
      }
      this.genChartButtonError = true;
    } else if (
      closed.length > 3 &&
      closed.length < 7 &&
      this.centerCheck === false
    ) {
      //console.log("Run Notice 1 Update");
      var mlsCheck = localStorage.getItem("f_mls");
      if (mlsCheck === "5d846e8de3b0d50d6ac91a2d") {
        Swal.fire({
          title: "Comp Computation Notice",
          html: "Notice: You have less than the minimum suggested Closed comparables. You can modify your search to expand your results, or you can proceed with less than the recommended number of Closed comparables.",
          width: "42em",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Comp Computation Notice",
          html: "We recommend at least 7 Closed comparables to get the most accurate suggested listing price. You can modify your search to expand your results, or you can proceed with less than the recommended number of Closed comparables.",
          width: "42em",
          confirmButtonText: "OK",
        });
      }
      this.genChartButtonError = false;
    } else {
      this.genChartButtonError = false;
    }
  }

  // Drawing Tools START
  initDrawingManager() {
    let map = this.mapObj;
    var poly = new google.maps.Polygon({
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
      draggable: true,
      editable: true,
      drawingControl: true,
    });
    poly.setMap(map);
    let self = this;
    google.maps.event.addListener(map, "click", function (event) {
      var path = poly.getPath();
      if (path.length > 1) {
        this.homes = [];
        self.selectedMarkers = [];
        self.mapMarkers.forEach(function (el, idx) {
          if (google.maps.geometry.poly.containsLocation(el.position, poly)) {
            self.selectedMarkers.push(el);
            self.mapMarkers[idx].setMap(self.mapObj);
          } else {
            self.mapMarkers[idx].setMap(null);
          }
        });
        //console.log("UN 1");
        //self.updateNums(self);
        poly.getPaths().forEach(function (path) {
          google.maps.event.addListener(path, "insert_at", function (event) {
            this.homes = [];
            self.selectedMarkers = [];
            self.mapMarkers.forEach(function (el, idx) {
              if (
                google.maps.geometry.poly.containsLocation(el.position, poly)
              ) {
                self.selectedMarkers.push(el);
                self.mapMarkers[idx].setMap(self.mapObj);
              } else {
                self.mapMarkers[idx].setMap(null);
              }
            });
            //console.log("UN 2");
            self.updateNums(self);
          });
        });
        poly.getPaths().forEach(function (path) {
          google.maps.event.addListener(path, "set_at", function (event) {
            this.homes = [];
            self.selectedMarkers = [];
            self.mapMarkers.forEach(function (el, idx) {
              if (
                google.maps.geometry.poly.containsLocation(el.position, poly)
              ) {
                self.selectedMarkers.push(el);
                self.mapMarkers[idx].setMap(self.mapObj);
              } else {
                self.mapMarkers[idx].setMap(null);
              }
            });
            //console.log("UN 3");
            self.updateNums(self);
          });
        });
      }
      path.push(event.latLng);
    });
    google.maps.event.addListener(poly, "dragend", function (dragEvent) {});
    this.poly = poly;
    return;
  }

  initRadiusManager() {
    let map = this.mapObj;
    var centerSet = map.getCenter();
    var radiusSet = 1000; // In Meters
    var circle = new google.maps.Circle({
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
      draggable: true,
      editable: true,
      center: centerSet,
      radius: radiusSet,
    });
    circle.setMap(map);
    //map.fitBounds(circle.getBounds());
    let self = this;

    /*google.maps.event.addListener(map, 'click', function(event) {
    circle.setMap(map);
  });*/

    google.maps.event.addListener(
      circle,
      "radius_changed",
      function (radiusEvent) {
        self.centerCheck = false;
        this.homes = [];
        self.selectedMarkers = [];
        radiusSet = circle.getRadius();
        centerSet = circle.getCenter();
        self.mapMarkers.forEach(function (el, idx) {
          if (
            google.maps.geometry.spherical.computeDistanceBetween(
              centerSet,
              self.mapMarkers[idx].position
            ) < radiusSet
          ) {
            self.selectedMarkers.push(el);
            self.mapMarkers[idx].setMap(self.mapObj);
          } else {
            self.mapMarkers[idx].setMap(null);
          }
        });
        //console.log("UN 4");
        self.updateNums(self);
        console.log("Radius Change");
      }
    );

    google.maps.event.addListener(
      circle,
      "center_changed",
      function (radiusEvent) {
        self.centerCheck = true;
        this.homes = [];
        self.selectedMarkers = [];
        radiusSet = circle.getRadius();
        centerSet = circle.getCenter();
        self.mapMarkers.forEach(function (el, idx) {
          if (
            google.maps.geometry.spherical.computeDistanceBetween(
              centerSet,
              self.mapMarkers[idx].position
            ) < radiusSet
          ) {
            self.selectedMarkers.push(el);
            self.mapMarkers[idx].setMap(self.mapObj);
          } else {
            self.mapMarkers[idx].setMap(null);
          }
        });
        //console.log("UN 5");
        self.updateNums(self);
        console.log("Center Change");
      }
    );

    google.maps.event.addListener(circle, "dragend", function (dragEvent) {
      self.centerCheck = false;
      self.updateNums(self);
      console.log("Drag End Circle");
    });

    this.circle = circle;
    return;
  }

  // Drawing Tools END

  generate_token() {
    this.loader = true;
    let body = {
      selected_mls: localStorage.getItem("f_mls"),
    };

    this.api.generate_token(body).subscribe(
      (dataResponse) => {
        //console.log(dataResponse);
        const response = dataResponse;
        //this.properties = response;
        localStorage.setItem("access_token", response.access_token);

        //console.log(response);
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        //this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
      }
    );
  }

  get_api_type() {
    this.loader = true;
    let body = {
      selected_mls: localStorage.getItem("f_mls"),
    };

    this.api.get_api_type(body).subscribe(
      (dataResponse) => {
        console.log(dataResponse);
        const response = dataResponse;
        //this.properties = response;
        if (response.api == "Bridge") {
          this.maxCount = 199;
        }
        this.currentApi = response.api;
        localStorage.setItem("api", response.api);
        //this.generate_token();
        //this.loader = false;
      },
      (error) => {
        this.loader = false;
        //this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
      }
    );
  }

  getProperties() {
    //console.log('in');
    //get_property
    this.properties = [];
    var properties = [];
    this.loader = true;
    //this.api.getPropertyList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
    //const response = dataResponse;
    //console.log(dataResponse);
    /* dataResponse.forEach(function (el, idx) {
        //console.log(el);
        //self.mapMarkers[idx].setMap(null);
        properties.push({
          _id: el._id,
          address: el.address,
          city: el.city,
          client: el.client,
          created: el.created,
          mls_user_id: el.mls_user_id,
          property_image: (el.property_image) ? el.property_image : '../../../assets/images/services1.png',
          square_footage: el.square_footage,
          state: el.state,
          updated: el.updated,
          zip: el.zip
        });
      });
      this.properties = properties; */
    //console.log(this.property_id_popup);

    if (this.property_id_popup != null) {
      this.loader = true;
      let propertyId = this.property_id_popup;
      /* this.properties.forEach(element => {
          if (propertyId == element._id) { */
      //this.showft1 = true;
      //this.showft = false;
      this.api.get_property(propertyId).subscribe(
        (dataResponse) => {
          //console.log(dataResponse.data);
          this.onGroup(dataResponse.data);
          this.loader = false;
        },
        (error) => {
          this.loader = false;
          //this.showMsgError = true;
          console.log(error);
          //this.errormsg = error.message;
        }
      );
      //property_id_popup
      //this.onGroup(element);
      /* }
        }); */
    } else if (this.chart_title != null && this.sqr_ft != null) {
      //this.showft1 = false;
      //this.showft = true;
      this.addChart.controls.chart_title.setValue(this.chart_title);
      this.addChart.controls.sqr_ft.setValue(this.sqr_ft);
    }

    if (this.Id != "redirectBackToAnalysis" && this.Id) {
      this.get_chart_details(this.Id);
    } else {
      this.callomp = true;
    }

    this.loader = false;
    /* },
      error => {
        this.loader = false;
        //this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
      }); */
  }

  addSubDivision() {
    var newSubDivision = this.selectedsub;
    if (newSubDivision && this.subDivisions.indexOf(newSubDivision) == -1) {
      //this.subDivisions.push(newSubDivision);
      if (this.zipCode.length > 0) {
        Swal.fire({
          title: this.Recommendation,
          html: "<h6>" + this.It_is_not_recommended + "</h6>",
          //type: 'info',
          width: "42em",
          showCancelButton: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Proceed",
        }).then((result) => {
          if (result.value) {
            //this.addChart.controls.min_date.setValue(this.minimumDate);
            //this.createMapMarkers();
            this.subDivisions.push(newSubDivision);
          }
        });
      } else {
        this.subDivisions.push(newSubDivision);
      }
    }
    this.addChart.controls.entered_sub.setValue("");
    if (this.mls_name === "Park City Board of Realtors") {
      this.get_pcbor_subs(this.areas[0]);
    } else {
      this.get_subdivisions();
    }
  }

  removeDiv(i) {
    this.subDivisions.splice(i, 1);
    //console.log(this.subDivisions);
  }

  addArea() {
    var newSubDivision = this.selectedarea;
    if (newSubDivision && this.areas.indexOf(newSubDivision) == -1) {
      this.areas.push(newSubDivision);
    }
    this.addChart.controls.entered_area.setValue("");
    this.pcborAreaSelected = true;
    this.get_pcbor_subs(this.areas[0]);
  }

  removeArea(i) {
    this.areas.splice(i, 1);
    this.pcborAreaSelected = false;
  }

  removeZip(i) {
    this.zipCode.splice(i, 1);
    //this.zipCode.slice(1,i+1);
  }

  addZipCode() {
    var newZipCode = this.selectedzip;
    if (newZipCode && this.zipCode.indexOf(newZipCode) == -1) {
      if (this.subDivisions.length > 0) {
        Swal.fire({
          title: this.Recommendation,
          html: "<h6>" + this.It_is_not_recommended + "</h6>",
          //type: 'info',
          width: "42em",
          showCancelButton: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Proceed",
        }).then((result) => {
          if (result.value) {
            //this.addChart.controls.min_date.setValue(this.minimumDate);
            //this.createMapMarkers();
            this.zipCode.push(newZipCode);
          }
        });
      } else {
        this.zipCode.push(newZipCode);
      }
      //this.zipCode.push(newZipCode);
    }
    this.addChart.controls.entered_zip.setValue("");
    this.get_zips();
  }

  removeZipCode() {
    this.zipCode.pop();
  }

  getMlsDetails() {
    var mls = localStorage.getItem("f_mls");
    const body = {
      id: mls,
    };
    this.api.get_mls_details(body).subscribe(
      (dataResponse) => {
        //console.log(dataResponse.data);
        this.mls_name = dataResponse.data.name;
        if (this.mls_name === "Park City Board of Realtors") {
          this.PCBORShow = true;
        }
        this.isExtraFields = dataResponse.data.is_extra_fields;
        this.hasRental = dataResponse.data.hasRental;
        if (dataResponse.data.server_id === "15") {
          //console.log("True");
          this.isCTAR = true;
        } else {
          //console.log("False");
          this.isCTAR = false;
        }
        //console.log(this.isExtraFields);
        //console.log(this.hasRental);
        this.extraFields = dataResponse.data.extra_fields;
        //if (dataResponse.data.subs_url) {
        if (this.mls_name === "Park City Board of Realtors") {
          //this.get_pcbor_subs();
        } else {
          this.get_subdivisions();
        }
        //}
        //if (dataResponse.data.zips_url) {
        this.get_zips();
        //}
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  onSortChange(e) {
    this.loader = false;
    this.selectedsub = e.target.value;
    //console.log(e.target.value);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onSortChange2(e) {
    this.loader = false;
    this.selectedzip = e.target.value;
    //console.log(e.target.value);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onSortChange3(e) {
    this.loader = false;
    this.selectedarea = e.target.value;
    //console.log(e.target.value);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  textChanged2(val) {
    let filter = val;
    if (filter.length >= 2) {
      this.get_zips(filter);
    }
    if (filter == "") {
      this.get_zips();
    }
  }

  textChanged(val) {
    let filter = val;
    console.log(filter.length);
    if (filter.length >= 2) {
      this.get_subdivisions(filter);
    }
    if (filter == "") {
      this.get_subdivisions();
    }
  }

  get f() {
    return this.addChart.controls;
  }

  validateChartForm() {
    this.addChart = this.formBuilder.group({
      chart_title: [""],
      groupName: [""],
      property_type: [""],
      pcbor_prop_type: [""],
      waterfront: [""],
      private_pool: [""],
      hopa: [""],
      hoa: [""],
      folionumber: [""],
      sqr_ft: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(3),
          Validators.maxLength(5),
          Validators.required,
        ],
      ],
      min_year: ["", [Validators.pattern(/^\d+$/)]],
      max_year: ["", [Validators.pattern(/^\d+$/)]],
      min_price: ["", [Validators.pattern(/^\d+$/)]],
      max_price: ["", [Validators.pattern(/^\d+$/)]],
      min_square_footage: ["", [Validators.pattern(/^\d+$/)]],
      max_square_footage: ["", [Validators.pattern(/^\d+$/)]],
      min_date: [this.minimumDate],
      max_date: [this.max_date],
      entered_area: [""],
      entered_sub: [""],
      entered_zip: [""],
      listing_type: ["Residential"],
      furnished: [""],
    });
    //console.log(this.addChart);
  }

  addChartSub() {
    if (!this.addChart.value.min_date) {
      Swal.fire({
        title: this.DateRangeError,
        html: "<h6>" + this.DateRangeErrortext + "</h6>",
        //type: 'info',
        width: "42em",
        showCancelButton: true,
        cancelButtonText: "I DISAGREE",
        confirmButtonText: "I AGREE",
      }).then((result) => {
        if (result.value) {
          this.addChart.controls.min_date.setValue(this.minimumDate);
          this.createMapMarkers();
        }
      });
    } else {
      this.createMapMarkers();
    }
  }

  createMapMarkers() {
    console.log("Create Marker Here");

    var activecounter = false;
    this.addchartformdata = this.addChart.value;

    this.addchartpropertyid = this.property_id;
    //console.log(this.newclient_id);

    this.addchartclientid = this.client_id;

    this.loader = true;

    console.log(this.mapMarkers);

    for (var i = 0; i < this.mapMarkers.length; i++) {
      this.mapMarkers[i].setMap(null);
    }

    if (this.poly) {
      //this.clear_polygon();
      this.showpolygon = true;
      this.clearpolygon = false;

      this.poly.setMap(null);
      this.poly = null;
      google.maps.event.clearListeners(this.mapObj, "click");
      google.maps.event.clearListeners(this.mapObj, "insert_at");
      var self = this;
      this.mapMarkers.forEach(function (el, idx) {
        self.mapMarkers[idx].setMap(null);
      });
    }
    if (this.circle) {
      this.showCircle = true;
      this.clearCircle = false;

      this.circle.setMap(null);
      this.circle = null;
      google.maps.event.clearListeners(this.mapObj, "click");
      google.maps.event.clearListeners(this.mapObj, "insert_at");
      var self = this;
      this.mapMarkers.forEach(function (el, idx) {
        self.mapMarkers[idx].setMap(null);
      });
    }

    this.mapMarkers = [];
    this.genChartButtonError = false;
    this.ShowChartBtn = false;
    this.homes = [];
    this.initialPayload = [];
    this.mapCenter = "";
    this.showPolygonButton = true;
    this.showCircleButton = true;
    this.total_count = 0;
    this.active_count = 0;
    this.pending_count = 0;
    this.cancel_count = 0;
    this.saveBody = {};
    this.clearpolygon = false;
    this.showpolygon = true;
    this.clearCircle = false;
    this.showCircle = true;
    var parsedAreas = null;
    if (this.areas[0] === "00 - None") {
      parsedAreas = "";
    } else {
      parsedAreas = this.areas[0];
    }
    const body = {
      access_token: localStorage.getItem("access_token"),
      isOutAPC: false,
      wildcardCheckPass: this.wildcardCheckPass,
      //'api': localStorage.getItem('api'),
      chart_title: this.addChart.value.chart_title,
      property_type: this.addChart.value.property_type,
      pcbor_prop_type: this.addChart.value.pcbor_prop_type,
      waterfront: this.addChart.value.waterfront,
      private_pool: this.addChart.value.private_pool,
      hopa: this.addChart.value.hopa,
      hoa: this.addChart.value.hoa,
      folionumber: this.addChart.value.folionumber,
      sqr_ft: this.addChart.value.sqr_ft,
      min_year: this.addChart.value.min_year,
      max_year: this.addChart.value.max_year,
      min_price: this.addChart.value.min_price,
      max_price: this.addChart.value.max_price,
      min_square_footage: this.addChart.value.min_square_footage,
      max_square_footage: this.addChart.value.max_square_footage,
      min_date: this.addChart.value.min_date,
      max_date: this.maximumDate,
      property_id: this.property_id,
      sub_divisions: this.subDivisions,
      area: parsedAreas,
      zip_code: this.zipCode,
      mls_id: localStorage.getItem("f_mls"),
      mls: this.mls_name,
      listing_type: this.addChart.value.listing_type,
      furnished: this.addChart.value.furnished,
      isSSO: false,
    };
    //console.log(body);
    this.api.addChart(body).subscribe(
      (dataResponse) => {
        console.log("Grabbing Data");
        this.saveBody = body;
        const response = dataResponse;
        if (response) {
          if (response.error) {
            console.log("Inital Data Error");
            this.loader = false;
            this.genChartButtonError = true;
            //this.showMsgError = true;
            this.ShowChartBtn = false;
            //console.log(response.error);
            Swal.fire({
              title: this.searcherrordata,
              html: this.searcherrordatahtml,
              width: "42em",
            });
            return false;
          }
          var updatedPayload = [];
          var payload = response.value;
          console.log("Grab Payload");
          console.log(payload);
          this.total_count = response.value.length;
          this.enablepolygon = true;
          this.enableCircle = true;
          for (var i = 0; i < payload.length; i++) {
            //someFn(arr[i]);
            updatedPayload.push(payload[i]);
          }

          if (payload.length > 0) {
            this.homes = payload;
            this.initialPayload = payload;
            //initialPayload = payload;
          } else {
            var payit = [];
            //payit.push(payload);
            this.homes = payit;
            this.initialPayload = payit;
            //initialPayload = payit;
          }

          var statusService = this.statusService;
          // let _this = this;

          var active = this.homes.filter(function (el) {
            // el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
            return el.StandardStatus === "Active";
          });

          var closed = this.homes.filter(function (el) {
            // el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
            return el.StandardStatus === "Closed";
          });

          var contingent = this.homes.filter(function (el) {
            // el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
            return el.StandardStatus === "Pending";
          });

          var comingSoon = this.homes.filter(function (el) {
            // el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
            return el.StandardStatus === "Active - Coming Soon";
          });

          this.active_count = active.length + comingSoon.length;

          this.cancel_count = closed.length;

          this.pending_count = contingent.length;

          if (updatedPayload.length > 0) {
            payload = updatedPayload;
            this.resultsCheck = true;
            if (updatedPayload.length <= this.maxCount) {
              this.mapMarkers = this.createMarkers(this.initialPayload);
            }
            this.ShowChartBtn = true;
          } else {
            this.ShowChartBtn = false;
            this.resultsCheck = false;
            Swal.fire({
              title: this.searcherrornothing,
              html: this.searcherrornothinghtml,
              width: "42em",
            });
          }

          //console.log(closed.length);

          // MAX and MIN CLOSED COMPS TO CREATE CHART
          this.hasSeven = closed.length < 7 ? false : true;
          this.hasThree = closed.length < 3 ? false : true;
          this.tooBig = closed.length > 100 ? true : false;

          if (this.homes.length > this.maxCount) {
            console.log(this.currentApi);

            this.genChartButtonError = true;
            if (this.currentApi != "Bridge") {
              Swal.fire({
                title: this.MaximumResultsExceeded,
                html: "<h6>" + this.MaximumResultsExceededtext + "<h6>",
                width: "42em",
                showCancelButton: true,
                confirmButtonText: "Search Again",
                cancelButtonText: "Proceed",
              }).then((result) => {
                console.log(result);
                /* Read more about isConfirmed, isDenied below */
                if (result.value) {
                  //Swal.fire('Saved!', '', 'success')
                } else if (result.dismiss) {
                  this.mapMarkers = this.createMarkers(this.initialPayload);
                  this.showPolygonButton = true;
                  this.showCircleButton = true;
                }
              });
            } else {
              Swal.fire({
                title: this.MaximumResultsExceeded,
                html: "<h6>" + this.MaximumResultsExceededtext + "<h6>",
                width: "42em",
                showCancelButton: true,
                confirmButtonText: "Search Again",
                cancelButtonText: "Proceed",
              }).then((result) => {
                console.log(result);
                /* Read more about isConfirmed, isDenied below */
                if (result.value) {
                  //Swal.fire('Saved!', '', 'success')
                } else if (result.dismiss) {
                  this.mapMarkers = this.createMarkers(this.initialPayload);
                  this.showPolygonButton = true;
                  this.showCircleButton = true;
                }
              });
            }
            this.showPolygonButton = false;
            this.showCircleButton = false;
            this.ShowChartBtn = true;
          } else if (!this.hasThree) {
            console.log("Run Notice 2");
            var mlsCheck = localStorage.getItem("f_mls");
            if (mlsCheck === "5d846e8de3b0d50d6ac91a2d") {
              Swal.fire({
                title: "Minimum Not Met",
                html: "Alert: You have less than the minimum number of Closed comparables required to generate a chart. Please select additional Closed comparables in order to generate a chart. We would recommend at least 5-6 additional closed comparables.",
                width: "42em",
                confirmButtonText: "OK",
              });
            } else {
              Swal.fire({
                title: "Minimum Not Met",
                html: "This search did not return the minimum number of Closed comparables required to generate a chart. Please modify your search to expand your results. We recommend at least 7 Closed comparables to get the most accurate suggested listing price.",
                width: "42em",
                confirmButtonText: "OK",
              });
            }
            this.genChartButtonError = true;
            this.showPolygonButton = false;
            this.showCircleButton = false;
          } else if (!this.hasSeven && this.hasThree) {
            console.log("Run Notice 1");
            var mlsCheck = localStorage.getItem("f_mls");
            if (mlsCheck === "5d846e8de3b0d50d6ac91a2d") {
              Swal.fire({
                title: "Comp Computation Notice",
                html: "Notice: You have less than the minimum suggested Closed comparables. You can modify your search to expand your results, or you can proceed with less than the recommended number of Closed comparables.",
                width: "42em",
                confirmButtonText: "OK",
              });
            } else {
              Swal.fire({
                title: "Comp Computation Notice",
                html: "We recommend at least 7 Closed comparables to get the most accurate suggested listing price. You can modify your search to expand your results, or you can proceed with less than the recommended number of Closed comparables.",
                width: "42em",
                confirmButtonText: "OK",
              });
            }
          } else if (this.tooBig) {
            this.genChartButtonError = true;
            this.showPolygonButton = true;
            this.showCircleButton = false;
          }
        } else {
          this.ShowChartBtn = false;
          this.loader = false;
          this.genChartButtonError = true;
          console.log(response);
          Swal.fire({
            title: this.searcherrordata,
            html: this.searcherrordatahtml,
            width: "42em",
          });
        }
        console.log("End Function");
        this.loader = false;
      },
      (error) => {
        this.ShowChartBtn = false;
        console.log("Data Error");
        this.loader = false;
        this.genChartButtonError = true;
        console.log(error);
        Swal.fire({
          title: this.searcherrordata,
          html: this.searcherrordatahtml,
          width: "42em",
        });
      }
    );
  }

  clickedMarker(label: string, index: number) {}

  mapClicked($event: MouseEvent) {}

  markerDragEnd(m: marker, $event: MouseEvent) {}

  zoomChange(event) {
    this.mapCenter = this.mapObj.getCenter();
  }

  createMarkers(arr) {
    //console.log("arr.length-"+arr.length);

    var bounds = new google.maps.LatLngBounds();
    var markitArr = [];
    for (var i = 0; i < arr.length; i++) {
      //console.log("Latitude"+arr[i].Latitude,"Longitude"+arr[i].Longitude);

      if (arr[i].Latitude === null || arr[i].Longitude === null) {
        //console.log(arr[i].StandardStatus);
        if (
          arr[i].StandardStatus === "Active" ||
          arr[i].StandardStatus === "A"
        ) {
          //this.active_count++;
        } else if (
          arr[i].StandardStatus === "Closed" ||
          arr[i].StandardStatus === "Sold" ||
          arr[i].StandardStatus === "S"
        ) {
          //this.cancel_count++;
        } else {
          //this.pending_count++;
        }
      } else {
        var latlng = new google.maps.LatLng(
          parseFloat(arr[i].Latitude),
          parseFloat(arr[i].Longitude)
        );

        //console.log(i + "--" + arr[i].StandardStatus);

        if (
          arr[i].StandardStatus != null &&
          (arr[i].StandardStatus.toLowerCase() === "active" ||
            arr[i].StandardStatus === "A" ||
            arr[i].StandardStatus.toLowerCase() === "active - coming soon")
        ) {
          //console.log(arr[i].StandardStatus);

          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObj,
            listingId: arr[i].ListingId,
            icon: "assets/images/darkgreen_MarkerO.png",
          });

          //this.active_count++;
        } else if (
          arr[i].StandardStatus != null &&
          (arr[i].StandardStatus.toLowerCase() === "closed" ||
            arr[i].StandardStatus.toLowerCase() === "sold" ||
            arr[i].StandardStatus === "S")
        ) {
          //console.log(arr[i].StandardStatus);

          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObj,
            listingId: arr[i].ListingId,
            icon: "assets/images/red_MarkerO.png",
          });

          //this.cancel_count++;
        } else {
          //console.log(arr[i].StandardStatus);

          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObj,
            listingId: arr[i].ListingId,
            icon: "assets/images/yellow_MarkerO.png",
          });

          //this.pending_count++;
        }

        bounds.extend(marker.position);

        markitArr.push(marker);
        //console.log("markitArr.length-"+markitArr.length)
      }
    }
    this.centerMarker = bounds;
    this.mapObj.fitBounds(bounds);
    /* console.log("markitArr.length-"+markitArr.length) */
    return markitArr;
  }

  /* openDialog() {
    const dialogRef = this.dialog.open(DialogPropertyComponent, {
      panelClass: 'property-dialog-container',
      data: {
        action: 'property'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.getProperties();

    });

  } */

  new_function() {
    console.log("Generating Here");
    //console.log(this.addChart.controls.chart_title.value)
    //console.log(this.addChart.controls.sqr_ft.value)
    //console.log(this.newclient_id);
    var formdata = [];
    formdata["agent"] = ""; //agent id

    if (this.Id == "redirectBackToAnalysis") {
      formdata["id"] = ""; //client id
    } else {
      formdata["id"] = this.Id; //client id
    }

    formdata["client"] = this.newclient_id; //client id
    formdata["targetProperty"] = this.addchartpropertyid; //property id
    formdata["sqr_ft"] = this.addChart.controls.sqr_ft.value; //property id
    formdata["chart_title"] = this.addChart.controls.chart_title.value;
    formdata["relatedProperty"] = this.saveBody; //current form data
    //console.log("Related Property: " + formdata['relatedProperty']);
    var inQueue = [];
    var self = this;
    var mls_key = this.mls_name;
    var statusService = this.statusService;

    this.homes.forEach(function (el) {
      //console.log(el.StandardStatus);
      var photoUrlArr = [];

      if (
        localStorage.getItem("api") === "Bridge" ||
        localStorage.getItem("api") === "CoreLogic"
      ) {
        if (el.Media) {
          if (el.Media.length > 0) {
            //console.log("Starting Photo Import");
            el.Media.forEach(function (pic) {
              photoUrlArr.push(pic.MediaURL);
            });
          }
        }
      } else {
        if (el.listing) {
          if (el.listing.photos.length > 0) {
            //console.log("Starting Photo Import");
            //if (el.listing.photos.filename.includes("Photo_0.jpeg")) {
            //console.log("Skip Matrix")
            //} else {
            el.listing.photos.forEach(function (pic) {
              photoUrlArr.push(pic.url);
            });
            //}
          }
        }
      }

      //console.log("New -"+el.StandardStatus);
      if (mls_key === "Coastal Carolina Association of REALTORS") {
        console.log("CCAR");
        console.log("Status: " + el.StandardStatus);
        console.log("Living Area: " + el.LivingArea);
        if (el.LivingArea > 0) {
          console.log("Pass 1");
          if (
            el.StreetNumber === null ||
            el.StreetName === null ||
            el.City === null ||
            el.ListPrice === null ||
            el.ListingId === null ||
            el.PostalCode === null ||
            el.StandardStatus === null
          ) {
            console.log("error " + el.StandardStatus);
          } else {
            console.log("Pass 2");
            var parsedDaysOnMarket = null;

            if (
              el.StandardStatus === "Active" &&
              el.ListingContractDate != null
            ) {
              //console.log("Active - " + el.StandardStatus);
              // Perform Math for Active Properties
              //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
              var currentDate = new Date();
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.ListingContractDate);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              //console.log("Miami Active Days: " + diffDays);
              parsedDaysOnMarket = diffDays;
            } else if (el.DaysOnMarket != null) {
              //console.log("Found DOM")
              parsedDaysOnMarket = el.DaysOnMarket;
            } else {
              //console.log("Zeroed DOM")
              parsedDaysOnMarket = "-";
            }

            if (parsedDaysOnMarket < 0) {
              //console.log("Found Negative Days for " + el.ListingId + ": " + parsedDaysOnMarket);
              parsedDaysOnMarket = Math.abs(parsedDaysOnMarket);
            } else {
              //console.log("Carry On")
            }

            //LPXDOM Calculation
            var parsedDaysOnMarketPriceChange = null;

            if (
              el.StandardStatus === "Closed" &&
              el.PriceChangeTimestamp != null &&
              el.OffMarketDate != null
            ) {
              // Perform Math for Closed Properties
              //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
              var closedDate = new Date(el.OffMarketDate);
              //console.log("A: " + closedDate);
              var entryDate = new Date(el.PriceChangeTimestamp);
              //console.log("B: " + entryDate);
              var timeDiff = closedDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              //console.log("Stellar Closed Days: " + diffDays);
              parsedDaysOnMarketPriceChange = diffDays;
            } else if (
              el.StandardStatus === "Pending" &&
              el.PriceChangeTimestamp != null &&
              el.ContractStatusChangeDate != null
            ) {
              // Perform Math for Active Properties
              //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
              var currentDate = new Date(el.ContractStatusChangeDate);
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.PriceChangeTimestamp);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              //console.log("Stellar Pending Days: " + diffDays);
              parsedDaysOnMarketPriceChange = diffDays;
            } else if (
              el.StandardStatus === "Active" &&
              el.PriceChangeTimestamp != null
            ) {
              // Perform Math for Active Properties
              //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
              var currentDate = new Date();
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.PriceChangeTimestamp);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              //console.log("Stellar Active Days: " + diffDays);
              parsedDaysOnMarketPriceChange = diffDays;
            } else {
              parsedDaysOnMarketPriceChange = "-";
            }

            if (
              parsedDaysOnMarketPriceChange != "-" &&
              parsedDaysOnMarket < parsedDaysOnMarketPriceChange
            ) {
              //console.log ("Correcting DOM")
              if (
                el.StandardStatus === "Closed" &&
                el.OriginalEntryTimestamp != null
              ) {
                // Perform Math for Closed Properties
                //console.log("Listing ID: " + el.ListingId)
                var closedDate = new Date(el.CloseDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.OriginalEntryTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Closed Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.OriginalEntryTimestamp != null
              ) {
                // Perform Math for Pending Properties
                //console.log("Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AA: " + currentDate);
                var entryDate = new Date(el.OriginalEntryTimestamp);
                //console.log("BB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Pending Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.OriginalEntryTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OriginalEntryTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else {
                //console.log ("Data not Accessible - Missing OriginalEntryTimestamp");
              }
            } else {
              //console.log("DOM is already Validated");
            }

            // Outlier Negative LPXDOM
            if (
              parsedDaysOnMarketPriceChange < 0 ||
              parsedDaysOnMarketPriceChange > parsedDaysOnMarket
            ) {
              //console.log("Dashed Negative")
              parsedDaysOnMarketPriceChange = parsedDaysOnMarket;
            } else {
              //console.log("Continue")
            }

            var parsedYearBuilt = el.YearBuilt != null ? el.YearBuilt : "-";
            var parsedListPrice = null;
            var parsedClosedPrice = null;
            var parsedSquareFootage = null;
            var parsedPrice = null;

            parsedListPrice = el.ListPrice ? parseInt(el.ListPrice) : "-";
            parsedClosedPrice = el.ClosePrice ? parseInt(el.ClosePrice) : "-";
            if (
              el.StandardStatus === "Active" ||
              el.StandardStatus === "Pending"
            ) {
              parsedSquareFootage = parseInt(el.LivingArea);
            } else {
              parsedSquareFootage = parseInt(el.LivingArea);
            }
            parsedPrice = parseInt(
              el.StandardStatus === "Closed" ? el.ClosePrice : el.ListPrice
            );

            var parsedPricePerSqFt = self.getPricePerSqFt(
              parsedPrice,
              parsedSquareFootage
            );
            var parsedSalesPriceToListPrice = self.getSalesPriceToListPrice(
              parsedClosedPrice,
              parsedListPrice
            );
            var parsedBathrooms;
            if (el.BathroomsFull === null && el.BathroomsHalf === null) {
              //console.log("Nothing Here At All")
              parsedBathrooms = "-";
            } else if (el.BathroomsHalf === 0) {
              //console.log("Nothing Here Half Zero")
              parsedBathrooms = parseInt(el.BathroomsFull);
            } else if (el.BathroomsHalf === null) {
              //console.log("Nothing Here Half Null")
              parsedBathrooms = parseInt(el.BathroomsFull);
            } else {
              //console.log("Do Math")
              parsedBathrooms =
                parseInt(el.BathroomsFull) + parseInt(el.BathroomsHalf) / 2;
            }

            if (isNaN(parsedBathrooms) || parsedBathrooms == "-") {
              parsedBathrooms = el.BathroomsTotalDecimal;
              //console.log("Got Value - " + parsedBathrooms);
              if (parsedBathrooms === null) {
                parsedBathrooms = "-";
                //console.log("Null Value")
              } else {
                var subNum = parsedBathrooms.substring(2, 3);
                var charLength = parsedBathrooms.length;
                if (subNum === "5") {
                  parsedBathrooms = parsedBathrooms.slice(0, charLength - 1);
                  //console.log("Sliced Value (.5): " + parsedBathrooms)
                } else {
                  parsedBathrooms = parsedBathrooms.slice(0, charLength - 3);
                  //console.log("Sliced Value (.0): " + parsedBathrooms)
                }
              }
            }

            //console.log(parsedBathrooms);

            var parsedBedrooms;
            parsedBedrooms = el.BedroomsTotal
              ? parseInt(el.BedroomsTotal)
              : "-";
            //console.log("ParsedBed: " + parsedBedrooms)
            //console.log("ParsedBath: " + parsedBathrooms)
            //console.log("ParsedDays: " + parsedDaysOnMarket)
            inQueue.push({
              mlsNumber: el.ListingId,
              address: el.StreetNumber + " " + el.StreetName,
              city: el.City,
              state: el.StateOrProvince,
              zip: el.PostalCode,
              lat: el.Latitude,
              long: el.Longitude,
              yearBuilt: parsedYearBuilt,
              bed: parsedBedrooms,
              bath: parsedBathrooms,
              days: parsedDaysOnMarket,
              daysPx: parsedDaysOnMarketPriceChange,
              status: el.StandardStatus,
              squareFootage: parsedSquareFootage,
              price: parsedPrice,
              closePrice: parsedClosedPrice,
              listPrice: parsedListPrice,
              saleDate: el.StandardStatus === "Closed" ? el.CloseDate : null,
              priceSqFt: parsedPricePerSqFt,
              salesToList: parsedSalesPriceToListPrice,
              photos: photoUrlArr,
            });
          }
        }
      } else {
        if (
          el.LivingArea != "0" ||
          el.LivingArea != null ||
          el.LivingArea > 1
        ) {
          if (
            el.StreetNumber === null ||
            el.StreetName === null ||
            el.City === null ||
            el.ListPrice === null ||
            el.ListingId === null ||
            el.PostalCode === null ||
            el.StandardStatus === null
          ) {
            console.log("error " + el.StandardStatus);
          } else {
            var parsedDaysOnMarket = null;

            // DOM Calculation
            if (mls_key === "CHS Regional MLS") {
              if (
                el.StandardStatus === "Active" &&
                el.ListingContractDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.ListingContractDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (mls_key === "Miami BOR") {
              if (el.StandardStatus === "Active" && el.OnMarketDate != null) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OnMarketDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                console.log("Miami Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (mls_key === "Stellar MLS") {
              if (
                el.StandardStatus === "Active" &&
                el.ListingContractDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.ListingContractDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (
              mls_key === "North Texas Real Estate Information Service"
            ) {
              if (
                el.StandardStatus === "Active" &&
                el.ListingContractDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.ListingContractDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (mls_key === "Canopy MLS") {
              if (
                el.StandardStatus === "Active" &&
                el.OriginalEntryTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OriginalEntryTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (
              mls_key === "First Multiple Listing Service" ||
              mls_key === "Georgia MLS" ||
              mls_key === "Intermountain MLS"
            ) {
              if (
                el.StandardStatus === "Active" &&
                el.ListingContractDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.ListingContractDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (mls_key === "RAPB + GFLR") {
              if (el.StandardStatus === "Active") {
                if (el.OriginalEntryTimestamp != null) {
                  // Perform Math for Active Properties
                  //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                  var currentDate = new Date();
                  //console.log("AAA: " + currentDate);
                  var entryDate = new Date(el.OriginalEntryTimestamp);
                  //console.log("BBB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Beach Active Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                } else if (el.OnMarketDate != null) {
                  // Perform Math for Active Properties
                  //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                  var currentDate = new Date();
                  //console.log("AAA: " + currentDate);
                  var entryDate = new Date(el.OnMarketDate);
                  //console.log("BBB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Miami Alt Active Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                }
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (mls_key === "Triad MLS") {
              if (
                (el.StandardStatus === "Active" ||
                  el.StandardStatus === "Pending") &&
                el.ListingContractDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.ListingContractDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Triad Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (
                el.StandardStatus === "Closed" &&
                el.ListingContractDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date(el.CloseDate);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.ListingContractDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Triad Closed Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else if (mls_key === "Park City Board of Realtors") {
              if (
                (el.StandardStatus === "Active" ||
                  el.StandardStatus === "Pending") &&
                el.OnMarketDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OnMarketDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("PCBOR Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            } else {
              if (
                el.DaysOnMarket === null &&
                el.StandardStatus === "Closed" &&
                el.OriginalEntryTimestamp != null
              ) {
                // Perform Math for Closed Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var closedDate = new Date(el.CloseDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.OriginalEntryTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Closed Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.OriginalEntryTimestamp != null
              ) {
                // Perform Math for Pending Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AA: " + currentDate);
                var entryDate = new Date(el.OriginalEntryTimestamp);
                //console.log("BB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Pending Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (
                el.DaysOnMarket === null &&
                el.StandardStatus === "Active" &&
                el.OriginalEntryTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OriginalEntryTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.DaysOnMarket != null) {
                //console.log("Found DOM")
                parsedDaysOnMarket = el.DaysOnMarket;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarket = "-";
              }
            }

            if (parsedDaysOnMarket < 0) {
              //console.log("Found Negative Days for " + el.ListingId + ": " + parsedDaysOnMarket);
              parsedDaysOnMarket = Math.abs(parsedDaysOnMarket);
            } else {
              //console.log("Carry On")
            }

            //LPXDOM Calculation
            var parsedDaysOnMarketPriceChange = null;
            if (mls_key === "Miami BOR") {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null &&
                el.PendingTimestamp != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.PendingTimestamp);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami LPXDOM Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null &&
                el.OffMarketDate != null
              ) {
                // Perform Math for Pending Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var currentDate = new Date(el.OffMarketDate);
                //console.log("AA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami LPXDOM Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami LPXDOM Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "RAPB + GFLR") {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null &&
                el.PendingTimestamp != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.PendingTimestamp);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Beach LPXDOM Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (el.StandardStatus === "Pending") {
                if (
                  el.PriceChangeTimestamp != null &&
                  el.OffMarketDate != null
                ) {
                  // Perform Math for Pending Properties
                  //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                  var currentDate = new Date(el.OffMarketDate);
                  //console.log("AA: " + currentDate);
                  var entryDate = new Date(el.PriceChangeTimestamp);
                  //console.log("BB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("OM LPXDOM Pending Days: " + diffDays);
                  parsedDaysOnMarketPriceChange = diffDays;
                } else if (
                  el.PriceChangeTimestamp != null &&
                  el.ListingContractDate != null
                ) {
                  // Perform Math for Pending Properties
                  //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                  var currentDate = new Date(el.ListingContractDate);
                  //console.log("AA: " + currentDate);
                  var entryDate = new Date(el.PriceChangeTimestamp);
                  //console.log("BB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("LCD LPXDOM Pending Days: " + diffDays);
                  parsedDaysOnMarketPriceChange = diffDays;
                } else {
                  parsedDaysOnMarketPriceChange = "-";
                }
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Beach LPXDOM Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "Stellar MLS") {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null &&
                el.OffMarketDate != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.OffMarketDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null &&
                el.OffMarketDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date(el.OffMarketDate);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "First Multiple Listing Service") {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null &&
                el.PurchaseContractDate != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.PurchaseContractDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null &&
                el.PurchaseContractDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date(el.PurchaseContractDate);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "Canopy MLS") {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null &&
                el.PendingTimestamp != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.PendingTimestamp);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null &&
                el.PendingTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date(el.PendingTimestamp);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "Georgia MLS") {
              if (
                el.StandardStatus === "Sold" &&
                el.PriceChangeTimestamp != null &&
                el.OffMarketDate != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.OffMarketDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null &&
                el.OffMarketDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date(el.OffMarketDate);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (
              mls_key === "North Texas Real Estate Information Service"
            ) {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null &&
                el.OffMarketDate != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.OffMarketDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null &&
                el.OffMarketDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date(el.OffMarketDate);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "Intermountain MLS") {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null &&
                el.CloseDate != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up IMLS C Listing ID: " + el.ListingId)
                var closedDate = new Date(el.CloseDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null &&
                el.StatusChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("LPXDOM Set-Up IMLS P Listing ID: " + el.ListingId)
                var currentDate = new Date(el.StatusChangeTimestamp);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Stellar Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "Triad MLS") {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.CloseDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami LPXDOM Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Pending Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami LPXDOM Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Miami LPXDOM Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            } else if (mls_key === "Park City Board of Realtors") {
              if (
                (el.StandardStatus === "Active" ||
                  el.StandardStatus === "Pending") &&
                el.OnMarketDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OnMarketDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("PCBOR Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Closed" &&
                el.OnMarketDate != null
              ) {
                // Perform Math for Active Properties
                //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
                var currentDate = new Date(el.CloseDate);
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OnMarketDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("PCBOR Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                //console.log("Zeroed DOM")
                parsedDaysOnMarketPriceChange = "-";
              }
            } else {
              if (
                el.StandardStatus === "Closed" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Closed Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var closedDate = new Date(el.CloseDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Closed Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Pending" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Pending Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Pending Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else if (
                el.StandardStatus === "Active" &&
                el.PriceChangeTimestamp != null
              ) {
                // Perform Math for Active Properties
                //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.PriceChangeTimestamp);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //console.log("Active Days: " + diffDays);
                parsedDaysOnMarketPriceChange = diffDays;
              } else {
                parsedDaysOnMarketPriceChange = "-";
              }
            }

            if (
              parsedDaysOnMarketPriceChange != "-" &&
              parsedDaysOnMarket < parsedDaysOnMarketPriceChange
            ) {
              //console.log ("Correcting DOM")
              if (mls_key === "Miami BOR") {
                if (
                  el.StandardStatus === "Closed" &&
                  el.OnMarketDate != null &&
                  el.PendingTimestamp != null
                ) {
                  // Perform Math for Closed Properties
                  //console.log("Listing ID: " + el.ListingId)
                  var closedDate = new Date(el.PendingTimestamp);
                  //console.log("A: " + closedDate);
                  var entryDate = new Date(el.OnMarketDate);
                  //console.log("B: " + entryDate);
                  var timeDiff = closedDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Closed Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                } else if (
                  el.StandardStatus === "Pending" &&
                  el.OnMarketDate != null
                ) {
                  // Perform Math for Pending Properties
                  //console.log("Listing ID: " + el.ListingId)
                  var currentDate = new Date();
                  //console.log("AA: " + currentDate);
                  var entryDate = new Date(el.OnMarketDate);
                  //console.log("BB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Pending Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                } else if (
                  el.StandardStatus === "Active" &&
                  el.OnMarketDate != null
                ) {
                  // Perform Math for Active Properties
                  //console.log("Listing ID: " + el.ListingId)
                  var currentDate = new Date();
                  //console.log("AAA: " + currentDate);
                  var entryDate = new Date(el.OnMarketDate);
                  //console.log("BBB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Active Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                } else {
                  //console.log ("Data not Accessible - Missing OriginalEntryTimestamp");
                }
              } else {
                if (
                  el.StandardStatus === "Closed" &&
                  el.OriginalEntryTimestamp != null
                ) {
                  // Perform Math for Closed Properties
                  //console.log("Listing ID: " + el.ListingId)
                  var closedDate = new Date(el.CloseDate);
                  //console.log("A: " + closedDate);
                  var entryDate = new Date(el.OriginalEntryTimestamp);
                  //console.log("B: " + entryDate);
                  var timeDiff = closedDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Closed Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                } else if (
                  el.StandardStatus === "Pending" &&
                  el.OriginalEntryTimestamp != null
                ) {
                  // Perform Math for Pending Properties
                  //console.log("Listing ID: " + el.ListingId)
                  var currentDate = new Date();
                  //console.log("AA: " + currentDate);
                  var entryDate = new Date(el.OriginalEntryTimestamp);
                  //console.log("BB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Pending Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                } else if (
                  el.StandardStatus === "Active" &&
                  el.OriginalEntryTimestamp != null
                ) {
                  // Perform Math for Active Properties
                  //console.log("Listing ID: " + el.ListingId)
                  var currentDate = new Date();
                  //console.log("AAA: " + currentDate);
                  var entryDate = new Date(el.OriginalEntryTimestamp);
                  //console.log("BBB: " + entryDate);
                  var timeDiff = currentDate.getTime() - entryDate.getTime();
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  //console.log("Active Days: " + diffDays);
                  parsedDaysOnMarket = diffDays;
                } else {
                  //console.log ("Data not Accessible - Missing OriginalEntryTimestamp");
                }
              }
            } else {
              //console.log("DOM is already Validated");
            }

            // Outlier Negative LPXDOM
            if (
              parsedDaysOnMarketPriceChange < 0 ||
              parsedDaysOnMarketPriceChange > parsedDaysOnMarket
            ) {
              //console.log("Dashed Negative")
              parsedDaysOnMarketPriceChange = parsedDaysOnMarket;
            } else {
              //console.log("Continue")
            }

            var parsedYearBuilt = el.YearBuilt != null ? el.YearBuilt : "-";
            var parsedListPrice = null;
            var parsedClosedPrice = null;
            var parsedSquareFootage = null;
            var parsedPrice = null;
            if (localStorage.getItem("api") === "Bridge") {
              parsedListPrice = el.ListPrice;
              parsedClosedPrice = el.ClosePrice;
              parsedSquareFootage = el.LivingArea;
              parsedPrice =
                el.StandardStatus === "Closed" ? el.ClosePrice : el.ListPrice;
            } else {
              parsedListPrice = el.ListPrice ? parseInt(el.ListPrice) : "-";
              parsedClosedPrice = el.ClosePrice ? parseInt(el.ClosePrice) : "-";
              parsedSquareFootage = parseInt(el.LivingArea);
              parsedPrice = parseInt(
                el.StandardStatus === "Closed" ? el.ClosePrice : el.ListPrice
              );
            }
            var parsedPricePerSqFt = self.getPricePerSqFt(
              parsedPrice,
              parsedSquareFootage
            );
            var parsedSalesPriceToListPrice = self.getSalesPriceToListPrice(
              parsedClosedPrice,
              parsedListPrice
            );
            var parsedBathrooms;

            if (el.BathroomsFull === null && el.BathroomsHalf === null) {
              //console.log("Nothing Here At All")
              parsedBathrooms = "-";
            } else if (el.BathroomsHalf === 0) {
              //console.log("Nothing Here Half Zero")
              parsedBathrooms = parseInt(el.BathroomsFull);
            } else if (el.BathroomsHalf === null) {
              //console.log("Nothing Here Half Null")
              parsedBathrooms = parseInt(el.BathroomsFull);
            } else {
              //console.log("Do Math")
              parsedBathrooms =
                parseInt(el.BathroomsFull) + parseInt(el.BathroomsHalf) / 2;
            }

            if (isNaN(parsedBathrooms) || parsedBathrooms == "-") {
              parsedBathrooms = el.BathroomsTotalDecimal;
              //console.log("Got Value - " + parsedBathrooms);
              if (parsedBathrooms === null) {
                parsedBathrooms = "-";
                //console.log("Null Value")
              } else {
                var subNum = parsedBathrooms.substring(2, 3);
                var charLength = parsedBathrooms.length;
                if (subNum === "5") {
                  parsedBathrooms = parsedBathrooms.slice(0, charLength - 1);
                  //console.log("Sliced Value (.5): " + parsedBathrooms)
                } else {
                  parsedBathrooms = parsedBathrooms.slice(0, charLength - 3);
                  //console.log("Sliced Value (.0): " + parsedBathrooms)
                }
              }
            }

            var parsedUnitNumber = "";
            if (el.UnitNumber != null) {
              parsedUnitNumber = "#" + el.UnitNumber;
            } else {
              //console.log("Null");
            }

            //console.log(parsedBathrooms);

            var parsedBedrooms;

            parsedBedrooms = el.BedroomsTotal
              ? parseInt(el.BedroomsTotal)
              : "-";

            inQueue.push({
              mlsNumber: el.ListingId,
              address:
                el.StreetNumber + " " + el.StreetName + " " + parsedUnitNumber,
              city: el.City,
              state: el.StateOrProvince,
              zip: el.PostalCode,
              lat: el.Latitude,
              long: el.Longitude,
              yearBuilt: parsedYearBuilt,
              bed: parsedBedrooms,
              bath: parsedBathrooms,
              days: parsedDaysOnMarket,
              daysPx: parsedDaysOnMarketPriceChange,
              status: el.StandardStatus,
              squareFootage: parsedSquareFootage,
              price: parsedPrice,
              closePrice: parsedClosedPrice,
              listPrice: parsedListPrice,
              saleDate: el.StandardStatus === "Closed" ? el.CloseDate : null,
              priceSqFt: parsedPricePerSqFt,
              salesToList: parsedSalesPriceToListPrice,
              photos: photoUrlArr,
            });
          }
        }
      }
    });

    formdata["relatedHomes"] = [];
    formdata["activeHomes"] = [];
    formdata["pendingHomes"] = [];
    formdata["closedHomes"] = [];
    formdata["offMarketHomes"] = [];

    for (var i = 0; i < inQueue.length; i++) {
      //console.log(inQueue[i].status);
      if (inQueue[i].status.toLowerCase() === "active") {
        console.log("Pulling Status of Active Home ");
        formdata["activeHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      } else if (inQueue[i].status.toLowerCase() === "pending") {
        console.log("Pulling Status of Pending Home ");
        formdata["pendingHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      } else if (inQueue[i].status.toLowerCase() === "active - coming soon") {
        console.log("Pulling Status of Pending-Coming Soon Home ");
        formdata["activeHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      } else {
        console.log("Pulling Status of Closed Home ");
        formdata["closedHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      }
    }

    formdata["marketConditions"] = [];
    formdata["marketConditions"]["compListingsTotal"] = this.total_count;
    formdata["marketConditions"]["compActiveListings"] = this.active_count;
    formdata["marketConditions"]["compSoldListings"] = this.cancel_count;
    formdata["marketConditions"]["compPendingListings"] =
      this.pending_count > 0 ? this.pending_count : 1;

    // Sends an established Date Range
    //console.log(new Date(),new Date(formdata['relatedProperty']['min_date']))
    formdata["marketConditions"]["dateRange"] = Math.ceil(
      Math.abs(
        <any>new Date() - <any>new Date(formdata["relatedProperty"]["min_date"])
      ) / 86400000
    );

    // Set Map Data for Chart-Detail
    formdata["mapDetailCenter"] = [];
    formdata["mapDetailCenter"]["lat"] = this.mapCenter.lat();
    formdata["mapDetailCenter"]["lng"] = this.mapCenter.lng();
    formdata["mapDetailCenter"]["zoom"] = this.mapObj.getZoom();

    var body = {
      activeHomes: formdata["activeHomes"],
      agent: formdata["agent"],
      client: formdata["client"],
      id: formdata["id"],
      closedHomes: formdata["closedHomes"],
      mapDetailCenter: {
        lat: formdata["mapDetailCenter"]["lat"],
        lng: formdata["mapDetailCenter"]["lng"],
        zoom: formdata["mapDetailCenter"]["zoom"],
      },
      marketConditions: {
        compListingsTotal: formdata["marketConditions"]["compListingsTotal"],
        compActiveListings: formdata["marketConditions"]["compActiveListings"],
        compSoldListings: formdata["marketConditions"]["compSoldListings"],
        compPendingListings:
          formdata["marketConditions"]["compPendingListings"],
        dateRange: formdata["marketConditions"]["dateRange"],
      },
      pendingHomes: formdata["pendingHomes"],
      relatedHomes: formdata["relatedHomes"],
      relatedProperty: formdata["relatedProperty"],
      targetProperty: formdata["targetProperty"],
      sqr_ft: formdata["sqr_ft"],
      chart_title: formdata["chart_title"],
    };

    return body;
  }

  generate_chart() {
    this.loader = true;
    let body = this.new_function();

    console.log(body);
    //return;

    this.api.addChartResponse(body).subscribe(
      (dataResponse) => {
        console.log("Response: " + dataResponse.response);

        var outlier = JSON.parse(dataResponse.response);

        console.log(outlier);

        var active_outliers = JSON.parse(outlier.active_outliers);
        var pending_outliers = JSON.parse(outlier.pending_outliers);
        var sold_outliers = JSON.parse(outlier.sold_outliers);

        /* console.log(active_outliers);
      console.log(pending_outliers);
      console.log(sold_outliers); */

        var closehomes = dataResponse.data.closedHomes;
        var outlierText = "";

        if (active_outliers.length > 0) {
          active_outliers.forEach((element) => {
            outlierText += element.address + " ,";
          });
        }

        if (pending_outliers.length > 0) {
          pending_outliers.forEach((element) => {
            outlierText += element.address + " ,";
          });
        }

        if (sold_outliers.length > 0) {
          sold_outliers.forEach((element) => {
            outlierText += element.address + " ,";
          });
        }

        outlierText = outlierText.slice(0, -1);

        var remainsClose = closehomes.length - sold_outliers.length;
        if (
          (active_outliers.length > 0 ||
            pending_outliers.length > 0 ||
            sold_outliers.length > 0) &&
          remainsClose >= 7
        ) {
          this.loader = false;
          Swal.fire({
            title:
              "The following outliers have been removed to ensure statistical accuracy. They were eliminated because of a significant difference in price or square footage.",
            text: outlierText,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok!",
            width: "42em",
          }).then((result) => {
            if (result.value) {
              this.loader = true;
              //dataResponse.data.id = body.id;
              //console.log(dataResponse.data);
              this.api.save_chart_db(dataResponse.data).subscribe(
                (dataResponse1) => {
                  console.log(dataResponse1);

                  if (this.Id == "redirectBackToAnalysis") {
                    this.router.navigate([
                      "/chart/" + dataResponse1._id + "/" + this.Id,
                    ]);
                  } else if (this.redirect == true) {
                    this.router.navigate([
                      "/chart/" + dataResponse1._id + "/redirectBackToAnalysis",
                    ]);
                  } else {
                    this.router.navigate(["/chart/" + dataResponse1._id]);
                  }
                },
                (error) => {
                  this.loader = false;
                  console.log(error);
                }
              );
            }
          });
        }

        if (sold_outliers.length > 0 && remainsClose < 7) {
          this.loader = false;
          Swal.fire({
            //type: 'error',
            title:
              "Too many outliers have been found and removed. There are not enough results to generate a chart. Please try your search again.",
            text: outlierText,
            width: "42em",
          });
        }

        if (
          active_outliers.length == 0 &&
          pending_outliers.length == 0 &&
          sold_outliers.length == 0
        ) {
          this.loader = true;
          this.api.save_chart_db(dataResponse.data).subscribe(
            (dataResponse1) => {
              if (this.Id == "redirectBackToAnalysis") {
                this.router.navigate([
                  "/chart/" + dataResponse1._id + "/" + this.Id,
                ]);
              } else if (this.redirect == true) {
                this.router.navigate([
                  "/chart/" + dataResponse1._id + "/redirectBackToAnalysis",
                ]);
              } else {
                this.router.navigate(["/chart/" + dataResponse1._id]);
              }
            },
            (error) => {
              this.loader = false;
              console.log(error);
            }
          );
        }
      },
      (error) => {
        this.loader = false;
        console.log(error);
        Swal.fire({
          title: this.CreateChartError,
          html: "<h6>" + this.CreateChartErrortext + "<h6>",
          width: "42em",
        });
      }
    );
  }

  getPricePerSqFt(listPrice, squareFootage) {
    var result = listPrice / squareFootage;
    return result;
  }

  getSalesPriceToListPrice(closePrice, listPrice) {
    var result = (closePrice / listPrice) * 100;
    return result;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    //console.log("destroy");
    if (this.dialog) {
      this.dialog.closeAll();
    }
  }

  countChangedHandler(count: number) {
    //this.ClickCounter = count;
    this.hiddenOmp = true;
    this.isLeftVisible = true;
  }

  singleOmpHandler(singleOmp) {
    //console.log(singleOmp);
    this.singleOmp = singleOmp;
  }

  ompformdataHandler(data) {
    this.hiddenOmp = true;
    this.isLeftVisible = true;
    //console.log(data);

    //this.ClickCounter = count;
    //console.log(data);
    //return;
    if (data.singleOmp) {
      this.generateOnlyOmpChart(data.formdata);
    } else {
      this.generateMergeOmpChart(data.formdata);
    }
    //this.generateOnlyOmpChart(data);
  }

  generateMergeOmpChart(dataResponse) {
    //console.log(dataResponse);
    let importbody = this.new_function2WithoutValidations(dataResponse);
    let body = this.new_function();
    //console.log(importbody);
    //console.log(body);
    let activeHomes;
    if (importbody.activeHomes) {
      activeHomes = body.activeHomes.concat(importbody.activeHomes);
    }

    let closedHomes;
    if (importbody.closedHomes) {
      closedHomes = body.closedHomes.concat(importbody.closedHomes);
    }

    let pendingHomes;
    if (importbody.pendingHomes) {
      pendingHomes = body.pendingHomes.concat(importbody.pendingHomes);
    }

    let relatedHomes;
    if (importbody.pendingHomes) {
      relatedHomes = body.relatedHomes.concat(importbody.relatedHomes);
    }

    //let pendingHomes = body.pendingHomes.concat(importbody.pendingHomes);

    //let relatedHomes = body.relatedHomes.concat(importbody.relatedHomes);

    var newbody = {
      activeHomes: activeHomes,
      agent: body.agent,
      client: body.client,
      id: body.id,
      closedHomes: closedHomes,
      mapDetailCenter: body.mapDetailCenter,
      marketConditions: body.marketConditions,
      pendingHomes: pendingHomes,
      relatedHomes: relatedHomes,
      relatedProperty: body.relatedProperty,
      targetProperty: body.targetProperty,
      sqr_ft: body.sqr_ft,
      chart_title: body.chart_title,
      offMarketHomes: importbody.offMarketHomes,
    };

    console.log(newbody);
    this.loader = true;
    this.api.addChartResponse(newbody).subscribe(
      (dataResponse) => {
        //console.log("Response: " + dataResponse.response);

        var outlier = JSON.parse(dataResponse.response);

        //console.log(outlier);

        var active_outliers = JSON.parse(outlier.active_outliers);
        var pending_outliers = JSON.parse(outlier.pending_outliers);
        var sold_outliers = JSON.parse(outlier.sold_outliers);

        var closehomes = dataResponse.data.closedHomes;
        var outlierText = "";

        if (active_outliers.length > 0) {
          active_outliers.forEach((element) => {
            outlierText += element.address + " ,";
          });
        }

        if (pending_outliers.length > 0) {
          pending_outliers.forEach((element) => {
            outlierText += element.address + " ,";
          });
        }

        if (sold_outliers.length > 0) {
          sold_outliers.forEach((element) => {
            outlierText += element.address + " ,";
          });
        }

        outlierText = outlierText.slice(0, -1);

        var remainsClose = closehomes.length - sold_outliers.length;
        if (
          (active_outliers.length > 0 ||
            pending_outliers.length > 0 ||
            sold_outliers.length > 0) &&
          remainsClose >= 7
        ) {
          this.loader = false;
          Swal.fire({
            title:
              "The following outliers have been removed to ensure statistical accuracy. They were eliminated because of a significant difference in price or square footage.",
            text: outlierText,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok!",
            width: "42em",
          }).then((result) => {
            if (result.value) {
              this.loader = true;
              //dataResponse.data.id = body.id;
              //console.log(dataResponse.data);
              this.api.save_chart_db(dataResponse.data).subscribe(
                (dataResponse1) => {
                  //console.log(dataResponse1);

                  if (this.Id == "redirectBackToAnalysis") {
                    this.router.navigate([
                      "/chart/" + dataResponse1._id + "/" + this.Id,
                    ]);
                  } else if (this.redirect == true) {
                    this.router.navigate([
                      "/chart/" + dataResponse1._id + "/redirectBackToAnalysis",
                    ]);
                  } else {
                    this.router.navigate(["/chart/" + dataResponse1._id]);
                  }
                },
                (error) => {
                  this.loader = false;
                  console.log(error);
                }
              );
            }
          });
        }

        if (sold_outliers.length > 0 && remainsClose < 7) {
          this.loader = false;
          Swal.fire({
            //type: 'error',
            title:
              "Too many outliers have been found and removed. There are not enough results to generate a chart. Please try your search again.",
            text: outlierText,
            width: "42em",
          });
        }

        if (
          active_outliers.length == 0 &&
          pending_outliers.length == 0 &&
          sold_outliers.length == 0
        ) {
          this.loader = true;
          this.api.save_chart_db(dataResponse.data).subscribe(
            (dataResponse1) => {
              if (this.Id == "redirectBackToAnalysis") {
                this.router.navigate([
                  "/chart/" + dataResponse1._id + "/" + this.Id,
                ]);
              } else if (this.redirect == true) {
                this.router.navigate([
                  "/chart/" + dataResponse1._id + "/redirectBackToAnalysis",
                ]);
              } else {
                this.router.navigate(["/chart/" + dataResponse1._id]);
              }
            },
            (error) => {
              this.loader = false;
              console.log(error);
            }
          );
        }
      },
      (error) => {
        this.loader = false;
        console.log(error);
        Swal.fire({
          title: this.CreateChartError,
          html: "<h6>" + this.CreateChartErrortext + "<h6>",
          width: "42em",
        });
      }
    );
  }

  ompformdataCountHandler(data) {
    this.hiddenOmp = true;
    this.isLeftVisible = true;
    //console.log(data);

    this.ompCount = data.length;
  }

  omp() {
    this.hiddenOmp = false;
    this.isLeftVisible = false;
    if (this.homes) {
      let searchPropertiesdata = this.new_function();
      //console.log(body);
      //this.searchPropertiesdata = body;
      //this.appState.set('mylist', myListCopy);
      this.sharedMlsService.setsearchPropertiesdata(searchPropertiesdata);

      //this.searchPropertiesdata.emit(body);
    }
  }

  new_function2(dataResponse) {
    var statusService = this.statusService;

    // let _this = this;

    var active = dataResponse.filter(function (el) {
      //console.log(el);

      el.StandardStatus = statusService.get_standardstatus(el["status"]);
      return el.StandardStatus === "Active";
    });

    var closed = dataResponse.filter(function (el) {
      el.StandardStatus = statusService.get_standardstatus(el["status"]);
      return el.StandardStatus === "Closed";
    });

    var contingent = dataResponse.filter(function (el) {
      el.StandardStatus = statusService.get_standardstatus(el["status"]);
      return el.StandardStatus === "Pending";
    });

    //console.log(closed.length);

    const hasSeven = closed.length < 7 ? false : true;
    const hasThree = closed.length < 3 ? false : true;
    const tooBig = closed.length > 100 ? true : false;
    //console.log(hasSeven);
    //console.log(tooBig);
    this.genChartButtonError = false;
    if (dataResponse.length > this.maxCount) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MaximumResultsExceeded,
        html: "<h6>" + this.MaximumResultsExceededtext + "<h6>",
        width: "42em",
      });
    } else if (!hasThree) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MinimumResultsError,
        html: "<h6>" + this.MinimumResultsErrortext + "<h6>",
        width: "42em",
      });
    } else if (tooBig) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MaximumResultsExceeded,
        html: "<h6>" + this.MaximumResultsExceededtext + "<h6>",
        width: "42em",
      });
    }
    //console.log(this.genChartButtonError);
    this.loader = false;
    var inQueue = [];

    if (!this.genChartButtonError) {
      dataResponse.forEach((element, index) => {
        //console.log(element);

        var parsedDaysOnMarketPriceChange = null;
        element["status"] = this.statusService.get_standardstatus(
          element.status
        );
        //console.log(element['Status']);

        if (element["status"]) {
          //const el = element;
          if (
            element["status"] === "Closed" &&
            element["Price Change Timestamp"] != null &&
            element["sold_date"] != null
          ) {
            // Perform Math for Closed Properties
            //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
            //console.log(element['Sold Date']);
            var closedDate = new Date(element["sold_date"]);
            //console.log("A: " + closedDate);
            var entryDate = new Date(element["Price Change Timestamp"]);
            //console.log("B: " + entryDate);
            var timeDiff = closedDate.getTime() - entryDate.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //console.log("Stellar Closed Days: " + diffDays);
            parsedDaysOnMarketPriceChange = diffDays;
          } else if (
            element["status"] === "Pending" &&
            element["Price Change Timestamp"] != null &&
            element["Status Change Date"] != null
          ) {
            // Perform Math for Active Properties
            //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
            var currentDate = new Date(element["Status Change Date"]);
            //console.log("AAA: " + currentDate);
            var entryDate = new Date(element["Price Change Timestamp"]);
            //console.log("BBB: " + entryDate);
            var timeDiff = currentDate.getTime() - entryDate.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //console.log("Stellar Pending Days: " + diffDays);
            parsedDaysOnMarketPriceChange = diffDays;
          } else if (
            element["status"] === "Active" &&
            element["Price Change Timestamp"] != null
          ) {
            // Perform Math for Active Properties
            //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
            var currentDate = new Date();
            //console.log("AAA: " + currentDate);
            var entryDate = new Date(element["Price Change Timestamp"]);
            //console.log("BBB: " + entryDate);
            var timeDiff = currentDate.getTime() - entryDate.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //console.log("Stellar Active Days: " + diffDays);
            parsedDaysOnMarketPriceChange = diffDays;
          } else {
            parsedDaysOnMarketPriceChange = "-";
          }

          inQueue.push({
            address: element["address"],
            bath: element["bathroom"],
            bed: element["bedroom"],
            city: element["city"],
            closePrice: element["sold_price"],
            days: element["days"],
            daysPx: parsedDaysOnMarketPriceChange,
            lat: element["latitude"],
            listPrice: element["listing_price"],
            long: element["longitude"],
            mlsNumber: index, //element["List Number"],
            photos: [
              element["photos"].length == 1
                ? element["photos"][0]
                : element["photos"],
            ], //[element['Photo URL']],
            price: parseInt(
              element["status"] === "Closed"
                ? element["sold_price"]
                : element["listing_price"]
            ),
            priceSqFt: "", //element["List Price/SqFt"],
            saleDate: element["sold_date"] ? element["sold_date"] : null,
            salesToList: element["saleDate"]
              ? (element["sold_price"] / element["listing_price"]) * 100
              : null,
            squareFootage: element["sqft"],
            state: element["state"],
            status: element["status"],
            yearBuilt: element["year_built"],
            zip: element["zip"],
          });
        }
      });

      //console.log(inQueue);
      //return;

      var formdata = [];

      formdata["agent"] = ""; //agent id

      formdata["id"] = ""; //client id

      formdata["client"] = this.newclient_id; //client id
      formdata["targetProperty"] = this.property_id; //property id
      formdata["sqr_ft"] = this.addChart.controls.sqr_ft.value; //property id
      formdata["chart_title"] = this.addChart.controls.chart_title.value;
      var parsedAreas = null;
      if (this.areas[0] === "00 - None") {
        parsedAreas = "";
      } else {
        parsedAreas = this.areas[0];
      }
      const body = {
        access_token: localStorage.getItem("access_token"),
        isOutAPC: false,
        wildcardCheckPass: this.wildcardCheckPass,
        //'api': localStorage.getItem('api'),
        chart_title: this.addChart.value.chart_title,
        property_type: this.addChart.value.property_type,
        pcbor_prop_type: this.addChart.value.pcbor_prop_type,
        waterfront: this.addChart.value.waterfront,
        private_pool: this.addChart.value.private_pool,
        hopa: this.addChart.value.hopa,
        hoa: this.addChart.value.hoa,
        folionumber: this.addChart.value.folionumber,
        sqr_ft: this.addChart.value.sqr_ft,
        min_year: this.addChart.value.min_year,
        max_year: this.addChart.value.max_year,
        min_price: this.addChart.value.min_price,
        max_price: this.addChart.value.max_price,
        min_square_footage: this.addChart.value.min_square_footage,
        max_square_footage: this.addChart.value.max_square_footage,
        min_date: this.addChart.value.min_date,
        max_date: this.maximumDate,
        property_id: this.property_id,
        sub_divisions: this.subDivisions,
        area: parsedAreas,
        zip_code: this.zipCode,
        mls_id: localStorage.getItem("f_mls"),
        mls: this.mls_name,
        listing_type: this.addChart.value.listing_type,
        furnished: this.addChart.value.furnished,
        isSSO: false,
      };

      formdata["relatedProperty"] = body; //current form data

      formdata["relatedHomes"] = [];
      formdata["activeHomes"] = [];
      formdata["pendingHomes"] = [];
      formdata["closedHomes"] = [];
      formdata["offMarketHomes"] = [];

      for (var i = 0; i < inQueue.length; i++) {
        //console.log(inQueue[i].status);
        if (inQueue[i].status.toLowerCase() === "active") {
          //console.log("Pulling Status of Active Home " + i + " : " + relatedHomes[i].status)
          formdata["activeHomes"].push(inQueue[i]);
          formdata["relatedHomes"].push(inQueue[i]);
        } else if (inQueue[i].status.toLowerCase() === "pending") {
          //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
          formdata["pendingHomes"].push(inQueue[i]);
          formdata["relatedHomes"].push(inQueue[i]);
        } else if (inQueue[i].status.toLowerCase() === "active - coming soon") {
          //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
          formdata["activeHomes"].push(inQueue[i]);
          formdata["relatedHomes"].push(inQueue[i]);
        } else {
          //console.log("Pulling Status of Closed Home " + i + " : " + relatedHomes[i].status)
          formdata["closedHomes"].push(inQueue[i]);
          formdata["relatedHomes"].push(inQueue[i]);
        }
      }

      formdata["marketConditions"] = [];
      formdata["marketConditions"]["compListingsTotal"] = dataResponse.length;
      formdata["marketConditions"]["compActiveListings"] = active.length;
      formdata["marketConditions"]["compSoldListings"] = closed.length;
      formdata["marketConditions"]["compPendingListings"] =
        contingent.length > 0 ? contingent.length : 1;

      // Sends an established Date Range
      //console.log(new Date(),new Date(formdata['relatedProperty']['min_date']))
      formdata["marketConditions"]["dateRange"] = Math.ceil(
        Math.abs(
          <any>new Date(new Date().setFullYear(new Date().getFullYear() - 1)) -
            <any>new Date()
        ) / 86400000
      );

      // Set Map Data for Chart-Detail
      formdata["mapDetailCenter"] = [];
      formdata["mapDetailCenter"]["lat"] = "";
      formdata["mapDetailCenter"]["lng"] = "";
      formdata["mapDetailCenter"]["zoom"] = "";
      var importbody = {
        activeHomes: formdata["activeHomes"],
        agent: formdata["agent"],
        client: formdata["client"],
        id: formdata["id"],
        closedHomes: formdata["closedHomes"],
        mapDetailCenter: {
          lat: formdata["mapDetailCenter"]["lat"],
          lng: formdata["mapDetailCenter"]["lng"],
          zoom: formdata["mapDetailCenter"]["zoom"],
        },
        marketConditions: {
          compListingsTotal: formdata["marketConditions"]["compListingsTotal"],
          compActiveListings:
            formdata["marketConditions"]["compActiveListings"],
          compSoldListings: formdata["marketConditions"]["compSoldListings"],
          compPendingListings:
            formdata["marketConditions"]["compPendingListings"],
          dateRange: formdata["marketConditions"]["dateRange"],
        },
        pendingHomes: formdata["pendingHomes"],
        relatedHomes: formdata["relatedHomes"],
        offMarketHomes: formdata["relatedHomes"],
        relatedProperty: formdata["relatedProperty"],
        targetProperty: formdata["targetProperty"],
        sqr_ft: formdata["sqr_ft"],
        chart_title: formdata["chart_title"],
      };

      return importbody;
    }
  }

  new_function2WithoutValidations(dataResponse) {
    var statusService = this.statusService;

    // let _this = this;

    var active = dataResponse.filter(function (el) {
      //console.log(el);

      el.StandardStatus = statusService.get_standardstatus(el["status"]);
      return el.StandardStatus === "Active";
    });

    var closed = dataResponse.filter(function (el) {
      el.StandardStatus = statusService.get_standardstatus(el["status"]);
      return el.StandardStatus === "Closed";
    });

    var contingent = dataResponse.filter(function (el) {
      el.StandardStatus = statusService.get_standardstatus(el["status"]);
      return el.StandardStatus === "Pending";
    });

    //console.log(closed.length);

    /* const hasSeven = closed.length < 7 ? false : true;
    const tooBig = closed.length > 100 ? true : false;
    //console.log(hasSeven);
    //console.log(tooBig);
    this.genChartButtonError = false;
    if (dataResponse.length > this.maxCount) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MaximumResultsExceeded,
        html: '<h6>' + this.MaximumResultsExceededtext + '<h6>',
        width: '42em'
      });
    } else if ((!hasSeven)) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MinimumResultsError,
        html: '<h6>' + this.MinimumResultsErrortext + '<h6>',
        width: '42em'
      });
    } else if ((tooBig)) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MaximumResultsExceeded,
        html: '<h6>' + this.MaximumResultsExceededtext + '<h6>',
        width: '42em'
      });
    } */
    //console.log(this.genChartButtonError);
    this.loader = false;
    var inQueue = [];

    //if(!this.genChartButtonError){

    dataResponse.forEach((element, index) => {
      //console.log(element);

      var parsedDaysOnMarketPriceChange = null;
      element["status"] = this.statusService.get_standardstatus(element.status);
      //console.log(element['Status']);

      if (element["status"]) {
        //const el = element;
        if (
          element["status"] === "Closed" &&
          element["Price Change Timestamp"] != null &&
          element["sold_date"] != null
        ) {
          // Perform Math for Closed Properties
          //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
          //console.log(element['Sold Date']);
          var closedDate = new Date(element["sold_date"]);
          //console.log("A: " + closedDate);
          var entryDate = new Date(element["Price Change Timestamp"]);
          //console.log("B: " + entryDate);
          var timeDiff = closedDate.getTime() - entryDate.getTime();
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          //console.log("Stellar Closed Days: " + diffDays);
          parsedDaysOnMarketPriceChange = diffDays;
        } else if (
          element["status"] === "Pending" &&
          element["Price Change Timestamp"] != null &&
          element["Status Change Date"] != null
        ) {
          // Perform Math for Active Properties
          //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
          var currentDate = new Date(element["Status Change Date"]);
          //console.log("AAA: " + currentDate);
          var entryDate = new Date(element["Price Change Timestamp"]);
          //console.log("BBB: " + entryDate);
          var timeDiff = currentDate.getTime() - entryDate.getTime();
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          //console.log("Stellar Pending Days: " + diffDays);
          parsedDaysOnMarketPriceChange = diffDays;
        } else if (
          element["status"] === "Active" &&
          element["Price Change Timestamp"] != null
        ) {
          // Perform Math for Active Properties
          //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
          var currentDate = new Date();
          //console.log("AAA: " + currentDate);
          var entryDate = new Date(element["Price Change Timestamp"]);
          //console.log("BBB: " + entryDate);
          var timeDiff = currentDate.getTime() - entryDate.getTime();
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          //console.log("Stellar Active Days: " + diffDays);
          parsedDaysOnMarketPriceChange = diffDays;
        } else {
          parsedDaysOnMarketPriceChange = "-";
        }

        inQueue.push({
          address: element["address"],
          bath: element["bathroom"],
          bed: element["bedroom"],
          city: element["city"],
          closePrice: element["sold_price"],
          days: element["days"],
          daysPx: parsedDaysOnMarketPriceChange,
          lat: element["latitude"],
          listPrice: element["listing_price"],
          long: element["longitude"],
          mlsNumber: index, //element["List Number"],
          photos: [
            element["photos"].length == 1
              ? element["photos"][0]
              : element["photos"],
          ], //[element['Photo URL']],
          price: parseInt(
            element["status"] === "Closed"
              ? element["sold_price"]
              : element["listing_price"]
          ),
          priceSqFt: "", //element["List Price/SqFt"],
          saleDate: element["sold_date"] ? element["sold_date"] : null,
          salesToList: element["saleDate"]
            ? (element["sold_price"] / element["listing_price"]) * 100
            : null,
          squareFootage: element["sqft"],
          state: element["state"],
          status: element["status"],
          yearBuilt: element["year_built"],
          zip: element["zip"],
        });
      }
    });

    //console.log(inQueue);
    //return;

    var formdata = [];

    formdata["agent"] = ""; //agent id

    formdata["id"] = ""; //client id

    formdata["client"] = this.newclient_id; //client id
    formdata["targetProperty"] = this.property_id; //property id
    formdata["sqr_ft"] = this.addChart.controls.sqr_ft.value; //property id
    formdata["chart_title"] = this.addChart.controls.chart_title.value;
    var parsedAreas = null;
    if (this.areas[0] === "00 - None") {
      parsedAreas = "";
    } else {
      parsedAreas = this.areas[0];
    }
    const body = {
      access_token: localStorage.getItem("access_token"),
      isOutAPC: false,
      wildcardCheckPass: this.wildcardCheckPass,
      //'api': localStorage.getItem('api'),
      chart_title: this.addChart.value.chart_title,
      property_type: this.addChart.value.property_type,
      pcbor_prop_type: this.addChart.value.pcbor_prop_type,
      waterfront: this.addChart.value.waterfront,
      private_pool: this.addChart.value.private_pool,
      hopa: this.addChart.value.hopa,
      hoa: this.addChart.value.hoa,
      folionumber: this.addChart.value.folionumber,
      sqr_ft: this.addChart.value.sqr_ft,
      min_year: this.addChart.value.min_year,
      max_year: this.addChart.value.max_year,
      min_price: this.addChart.value.min_price,
      max_price: this.addChart.value.max_price,
      min_square_footage: this.addChart.value.min_square_footage,
      max_square_footage: this.addChart.value.max_square_footage,
      min_date: this.addChart.value.min_date,
      max_date: this.maximumDate,
      property_id: this.property_id,
      sub_divisions: this.subDivisions,
      area: parsedAreas,
      zip_code: this.zipCode,
      mls_id: localStorage.getItem("f_mls"),
      mls: this.mls_name,
      listing_type: this.addChart.value.listing_type,
      furnished: this.addChart.value.furnished,
      isSSO: false,
    };

    formdata["relatedProperty"] = body; //current form data

    formdata["relatedHomes"] = [];
    formdata["activeHomes"] = [];
    formdata["pendingHomes"] = [];
    formdata["closedHomes"] = [];
    formdata["offMarketHomes"] = [];

    for (var i = 0; i < inQueue.length; i++) {
      //console.log(inQueue[i].status);
      if (inQueue[i].status.toLowerCase() === "active") {
        //console.log("Pulling Status of Active Home " + i + " : " + relatedHomes[i].status)
        formdata["activeHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      } else if (inQueue[i].status.toLowerCase() === "pending") {
        //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
        formdata["pendingHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      } else if (inQueue[i].status.toLowerCase() === "active - coming soon") {
        //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
        formdata["activeHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      } else {
        //console.log("Pulling Status of Closed Home " + i + " : " + relatedHomes[i].status)
        formdata["closedHomes"].push(inQueue[i]);
        formdata["relatedHomes"].push(inQueue[i]);
      }
    }

    formdata["marketConditions"] = [];
    formdata["marketConditions"]["compListingsTotal"] = dataResponse.length;
    formdata["marketConditions"]["compActiveListings"] = active.length;
    formdata["marketConditions"]["compSoldListings"] = closed.length;
    formdata["marketConditions"]["compPendingListings"] =
      contingent.length > 0 ? contingent.length : 1;

    // Sends an established Date Range
    //console.log(new Date(),new Date(formdata['relatedProperty']['min_date']))
    formdata["marketConditions"]["dateRange"] = Math.ceil(
      Math.abs(
        <any>new Date(new Date().setFullYear(new Date().getFullYear() - 1)) -
          <any>new Date()
      ) / 86400000
    );

    // Set Map Data for Chart-Detail
    formdata["mapDetailCenter"] = [];
    formdata["mapDetailCenter"]["lat"] = "";
    formdata["mapDetailCenter"]["lng"] = "";
    formdata["mapDetailCenter"]["zoom"] = "";
    var importbody = {
      activeHomes: formdata["activeHomes"],
      agent: formdata["agent"],
      client: formdata["client"],
      id: formdata["id"],
      closedHomes: formdata["closedHomes"],
      mapDetailCenter: {
        lat: formdata["mapDetailCenter"]["lat"],
        lng: formdata["mapDetailCenter"]["lng"],
        zoom: formdata["mapDetailCenter"]["zoom"],
      },
      marketConditions: {
        compListingsTotal: formdata["marketConditions"]["compListingsTotal"],
        compActiveListings: formdata["marketConditions"]["compActiveListings"],
        compSoldListings: formdata["marketConditions"]["compSoldListings"],
        compPendingListings:
          formdata["marketConditions"]["compPendingListings"],
        dateRange: formdata["marketConditions"]["dateRange"],
      },
      pendingHomes: formdata["pendingHomes"],
      relatedHomes: formdata["relatedHomes"],
      offMarketHomes: formdata["relatedHomes"],
      relatedProperty: formdata["relatedProperty"],
      targetProperty: formdata["targetProperty"],
      sqr_ft: formdata["sqr_ft"],
      chart_title: formdata["chart_title"],
    };

    return importbody;
    //}
  }

  generateOnlyOmpChart(dataResponse) {
    //var dataResponse = JSON.parse(this.dataRes);

    if (dataResponse) {
      this.loader = true;
      let importbody = this.new_function2(dataResponse);

      this.api.addChartResponse(importbody).subscribe(
        (dataResponse) => {
          this.api.save_chart_db(dataResponse.data).subscribe(
            (dataResponse1) => {
              localStorage.setItem("investFlag", "true");
              if (this.Id == "redirectBackToAnalysis") {
                this.router.navigate([
                  "/chart/" + dataResponse1._id + "/" + this.Id,
                ]);
              } else if (this.redirect == true) {
                this.router.navigate([
                  "/chart/" + dataResponse1._id + "/redirectBackToAnalysis",
                ]);
              } else {
                this.router.navigate(["/chart/" + dataResponse1._id]);
              }
              //this.router.navigate(['/chart/' + dataResponse1._id]);
            },
            (error) => {
              this.loader = false;
              console.log(error);
            }
          );
        },
        (error) => {
          this.loader = false;
          console.log(error);
        }
      );
    }
  }

  wildcardCheckValid() {
    this.wildcardCheckPass = !this.wildcardCheckPass;
  }

  backtoanalysis() {
    var remember_investment_id = localStorage.getItem("remember_investment_id");

    console.log(remember_investment_id);

    if (remember_investment_id != "undefined") {
      this.router.navigate([
        "/analysis/" + remember_investment_id + "/redirectBackToAnalysis/",
      ]);
    } else {
      this.router.navigate(["/analysis/new-investment/redirectBackToAnalysis"]);
    }
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
