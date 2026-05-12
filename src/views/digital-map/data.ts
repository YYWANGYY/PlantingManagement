export type PlantingMode = "field" | "facility"

export interface StatCard {
  label: string
  value: string | number
  unit: string
  icon: string
  bgClass: string
  iconColor: string
}

export interface CropRankItem {
  name: string
  area: number
  color: string
}

export interface PlotData {
  id: string
  name: string
  crop: string
  area: number
  color: string
  coordinates: [number, number][]
}

export interface FieldPlantRecord {
  id: string
  regionCompany: string
  farm: string
  branch: string
  crop: string
  variety: string
  plannedArea: number
  actualArea: number
  taskCount: number
  completionRate: number
  plotId: string
}

export interface FacilityPlantRecord {
  id: string
  regionCompany: string
  farm: string
  branch: string
  crop: string
  variety: string
  greenhouseArea: number
  interGreenArea: number
  arableArea: number
  actualArea: number
  taskCount: number
  completionRate: number
  plotId: string
}

export interface FieldSubRecord {
  id: string
  regionCompany: string
  farm: string
  branch: string
  unit: string
  crop: string
  variety: string
  plannedArea: number
  actualArea: number
  taskCount: number
  completionRate: number
  plotId: string
}

export interface FacilitySubRecord {
  id: string
  regionCompany: string
  farm: string
  branch: string
  unit: string
  crop: string
  variety: string
  greenhouseArea: number
  interGreenArea: number
  arableArea: number
  actualArea: number
  taskCount: number
  completionRate: number
  plotId: string
}

export interface TreeNode {
  label: string
  value: string
  children?: TreeNode[]
}

export const cropColors: Record<string, string> = {
  "水稻": "#22c55e",
  "小麦": "#eab308",
  "玉米": "#f97316",
  "大豆": "#ef4444",
  "棉花": "#a855f7",
  "油菜": "#facc15",
  "花生": "#f59e0b",
  "红薯": "#dc2626",
  "番茄": "#ef4444",
  "黄瓜": "#22c55e",
  "草莓": "#ec4899",
  "辣椒": "#f97316",
  "茄子": "#7c3aed",
  "西瓜": "#16a34a",
}

export const fieldStats: StatCard[] = [
  { label: "宗地总数", value: 32, unit: "宗", icon: "LandPlot", bgClass: "bg-blue-500/10", iconColor: "text-blue-500" },
  { label: "地块总数", value: 128, unit: "块", icon: "Map", bgClass: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  { label: "种植作物总数", value: 12, unit: "种", icon: "Sprout", bgClass: "bg-amber-500/10", iconColor: "text-amber-500" },
  { label: "种植品种总数", value: 36, unit: "个", icon: "Wheat", bgClass: "bg-orange-500/10", iconColor: "text-orange-500" },
  { label: "种植面积总数", value: "9,860", unit: "亩", icon: "AreaChart", bgClass: "bg-green-500/10", iconColor: "text-green-500" },
]

export const facilityStats: StatCard[] = [
  { label: "设备总数", value: 486, unit: "台", icon: "Cpu", bgClass: "bg-primary/10", iconColor: "text-primary" },
  { label: "种植作物总数", value: 8, unit: "种", icon: "Sprout", bgClass: "bg-amber-500/10", iconColor: "text-amber-500" },
  { label: "大棚总数", value: 64, unit: "座", icon: "Warehouse", bgClass: "bg-blue-500/10", iconColor: "text-blue-500" },
  { label: "大棚种植总面积", value: "1,920", unit: "亩", icon: "Home", bgClass: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  { label: "棚间地种植总面积", value: 380, unit: "亩", icon: "Fence", bgClass: "bg-orange-500/10", iconColor: "text-orange-500" },
  { label: "所属耕地种植总面积", value: "2,580", unit: "亩", icon: "AreaChart", bgClass: "bg-green-500/10", iconColor: "text-green-500" },
]

export const fieldCropRank: CropRankItem[] = [
  { name: "水稻", area: 3200, color: "#22c55e" },
  { name: "玉米", area: 2800, color: "#f97316" },
  { name: "小麦", area: 2200, color: "#eab308" },
  { name: "大豆", area: 1600, color: "#ef4444" },
  { name: "棉花", area: 1200, color: "#a855f7" },
  { name: "油菜", area: 800, color: "#facc15" },
  { name: "花生", area: 600, color: "#f59e0b" },
  { name: "红薯", area: 400, color: "#dc2626" },
]

export const facilityCropRank: CropRankItem[] = [
  { name: "番茄", area: 480, color: "#ef4444" },
  { name: "黄瓜", area: 420, color: "#22c55e" },
  { name: "草莓", area: 360, color: "#ec4899" },
  { name: "辣椒", area: 300, color: "#f97316" },
  { name: "茄子", area: 260, color: "#7c3aed" },
  { name: "西瓜", area: 200, color: "#16a34a" },
]

export const fieldPlots: PlotData[] = [
  {
    id: "P001", name: "华山东区地块", crop: "水稻", area: 3200,
    color: "#22c55e",
    coordinates: [[116.410, 39.920], [116.420, 39.920], [116.425, 39.910], [116.415, 39.905], [116.405, 39.910]]
  },
  {
    id: "P002", name: "华山西区地块", crop: "小麦", area: 2200,
    color: "#eab308",
    coordinates: [[116.380, 39.915], [116.395, 39.918], [116.400, 39.908], [116.390, 39.902], [116.378, 39.907]]
  },
  {
    id: "P003", name: "红星北区地块", crop: "玉米", area: 2800,
    color: "#f97316",
    coordinates: [[116.430, 39.935], [116.448, 39.938], [116.455, 39.925], [116.445, 39.918], [116.430, 39.922]]
  },
  {
    id: "P004", name: "兴安南区地块", crop: "大豆", area: 1600,
    color: "#ef4444",
    coordinates: [[116.360, 39.895], [116.375, 39.898], [116.380, 39.888], [116.370, 39.882], [116.358, 39.887]]
  },
  {
    id: "P005", name: "永丰地块", crop: "棉花", area: 1200,
    color: "#a855f7",
    coordinates: [[116.440, 39.890], [116.455, 39.893], [116.460, 39.883], [116.450, 39.877], [116.438, 39.882]]
  },
  {
    id: "P006", name: "合发地块", crop: "花生", area: 600,
    color: "#f59e0b",
    coordinates: [[116.400, 39.880], [116.412, 39.882], [116.416, 39.873], [116.408, 39.868], [116.398, 39.873]]
  },
  {
    id: "P007", name: "白云地块", crop: "红薯", area: 400,
    color: "#dc2626",
    coordinates: [[116.370, 39.870], [116.382, 39.872], [116.386, 39.863], [116.378, 39.858], [116.368, 39.863]]
  },
  {
    id: "P008", name: "嫩江地块", crop: "油菜", area: 800,
    color: "#facc15",
    coordinates: [[116.350, 39.860], [116.365, 39.863], [116.370, 39.853], [116.360, 39.848], [116.348, 39.853]]
  }
]

export const facilityPlots: PlotData[] = [
  {
    id: "G001", name: "华康温室群", crop: "番茄", area: 480,
    color: "#ef4444",
    coordinates: [[116.410, 39.830], [116.422, 39.832], [116.426, 39.822], [116.418, 39.817], [116.408, 39.822]]
  },
  {
    id: "G002", name: "雨林大棚区", crop: "黄瓜", area: 420,
    color: "#22c55e",
    coordinates: [[116.380, 39.825], [116.392, 39.828], [116.396, 39.818], [116.388, 39.813], [116.378, 39.818]]
  },
  {
    id: "G003", name: "康保草莓园", crop: "草莓", area: 360,
    color: "#ec4899",
    coordinates: [[116.430, 39.815], [116.442, 39.818], [116.446, 39.808], [116.438, 39.803], [116.428, 39.808]]
  },
  {
    id: "G004", name: "盘锦辣椒棚", crop: "辣椒", area: 300,
    color: "#f97316",
    coordinates: [[116.440, 39.840], [116.452, 39.842], [116.456, 39.832], [116.448, 39.827], [116.438, 39.832]]
  },
  {
    id: "G005", name: "红海滩茄子棚", crop: "茄子", area: 260,
    color: "#7c3aed",
    coordinates: [[116.360, 39.835], [116.372, 39.838], [116.376, 39.828], [116.368, 39.823], [116.358, 39.828]]
  },
  {
    id: "G006", name: "梅河口西瓜棚", crop: "西瓜", area: 200,
    color: "#16a34a",
    coordinates: [[116.400, 39.845], [116.412, 39.848], [116.416, 39.838], [116.408, 39.833], [116.398, 39.838]]
  }
]

export const fieldPlantList: Record<string, FieldPlantRecord[]> = {
  "水稻": [
    { id: "F-R01", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", crop: "水稻", variety: "龙粳31", plannedArea: 800, actualArea: 780, taskCount: 12, completionRate: 0.92, plotId: "P001" },
    { id: "F-R02", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", crop: "水稻", variety: "松粳22", plannedArea: 1200, actualArea: 1150, taskCount: 15, completionRate: 0.87, plotId: "P001" },
    { id: "F-R03", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "兴城分场", crop: "水稻", variety: "辽星1号", plannedArea: 600, actualArea: 580, taskCount: 8, completionRate: 0.75, plotId: "P001" },
    { id: "F-R04", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "雨林分场", crop: "水稻", variety: "龙粳46", plannedArea: 400, actualArea: 390, taskCount: 6, completionRate: 1.0, plotId: "P001" },
    { id: "F-R05", regionCompany: "沈阳公司", farm: "长春农场", branch: "九台分场", crop: "水稻", variety: "吉粳88", plannedArea: 200, actualArea: 190, taskCount: 4, completionRate: 0.50, plotId: "P001" },
  ],
  "小麦": [
    { id: "F-W01", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", crop: "小麦", variety: "龙麦33", plannedArea: 600, actualArea: 580, taskCount: 8, completionRate: 0.88, plotId: "P002" },
    { id: "F-W02", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", crop: "小麦", variety: "辽春18", plannedArea: 900, actualArea: 870, taskCount: 10, completionRate: 0.90, plotId: "P002" },
    { id: "F-W03", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "白云分场", crop: "小麦", variety: "克旱16", plannedArea: 500, actualArea: 480, taskCount: 7, completionRate: 0.86, plotId: "P002" },
    { id: "F-W04", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "永丰分场", crop: "小麦", variety: "龙麦35", plannedArea: 200, actualArea: 185, taskCount: 3, completionRate: 1.0, plotId: "P002" },
  ],
  "玉米": [
    { id: "F-C01", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", crop: "玉米", variety: "先玉335", plannedArea: 1000, actualArea: 960, taskCount: 12, completionRate: 0.83, plotId: "P003" },
    { id: "F-C02", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "合发分场", crop: "玉米", variety: "德美亚3", plannedArea: 800, actualArea: 770, taskCount: 10, completionRate: 0.80, plotId: "P003" },
    { id: "F-C03", regionCompany: "沈阳公司", farm: "长春农场", branch: "梅河口分场", crop: "玉米", variety: "吉单50", plannedArea: 600, actualArea: 580, taskCount: 8, completionRate: 0.88, plotId: "P003" },
    { id: "F-C04", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "康保分场", crop: "玉米", variety: "丰禾1号", plannedArea: 400, actualArea: 385, taskCount: 5, completionRate: 1.0, plotId: "P003" },
  ],
  "大豆": [
    { id: "F-S01", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "合发分场", crop: "大豆", variety: "黑河43", plannedArea: 600, actualArea: 575, taskCount: 8, completionRate: 0.88, plotId: "P004" },
    { id: "F-S02", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", crop: "大豆", variety: "合丰55", plannedArea: 500, actualArea: 480, taskCount: 6, completionRate: 0.83, plotId: "P004" },
    { id: "F-S03", regionCompany: "沈阳公司", farm: "长春农场", branch: "九台分场", crop: "大豆", variety: "吉育86", plannedArea: 500, actualArea: 470, taskCount: 7, completionRate: 0.71, plotId: "P004" },
  ],
  "棉花": [
    { id: "F-CT01", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", crop: "棉花", variety: "辽棉17", plannedArea: 500, actualArea: 480, taskCount: 7, completionRate: 0.86, plotId: "P005" },
    { id: "F-CT02", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "兴城分场", crop: "棉花", variety: "辽棉25", plannedArea: 400, actualArea: 385, taskCount: 5, completionRate: 1.0, plotId: "P005" },
    { id: "F-CT03", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", crop: "棉花", variety: "辽棉17", plannedArea: 300, actualArea: 290, taskCount: 4, completionRate: 0.75, plotId: "P005" },
  ],
  "油菜": [
    { id: "F-Y01", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "白云分场", crop: "油菜", variety: "青杂5号", plannedArea: 400, actualArea: 385, taskCount: 5, completionRate: 0.80, plotId: "P008" },
    { id: "F-Y02", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "合发分场", crop: "油菜", variety: "青杂9号", plannedArea: 400, actualArea: 390, taskCount: 5, completionRate: 1.0, plotId: "P008" },
  ],
  "花生": [
    { id: "F-H01", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", crop: "花生", variety: "四粒红", plannedArea: 300, actualArea: 285, taskCount: 4, completionRate: 0.75, plotId: "P006" },
    { id: "F-H02", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "康保分场", crop: "花生", variety: "白沙1016", plannedArea: 300, actualArea: 290, taskCount: 4, completionRate: 1.0, plotId: "P006" },
  ],
  "红薯": [
    { id: "F-HS01", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "雨林分场", crop: "红薯", variety: "烟薯25", plannedArea: 200, actualArea: 190, taskCount: 3, completionRate: 0.67, plotId: "P007" },
    { id: "F-HS02", regionCompany: "沈阳公司", farm: "长春农场", branch: "梅河口分场", crop: "红薯", variety: "济薯26", plannedArea: 200, actualArea: 195, taskCount: 3, completionRate: 1.0, plotId: "P007" },
  ],
}

export const facilityPlantList: Record<string, FacilityPlantRecord[]> = {
  "番茄": [
    { id: "G-T01", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", crop: "番茄", variety: "粉太郎", greenhouseArea: 85, interGreenArea: 12, arableArea: 110, actualArea: 105, taskCount: 18, completionRate: 0.89, plotId: "G001" },
    { id: "G-T02", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "康保分场", crop: "番茄", variety: "中杂9号", greenhouseArea: 70, interGreenArea: 10, arableArea: 90, actualArea: 85, taskCount: 12, completionRate: 0.83, plotId: "G001" },
    { id: "G-T03", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "兴城分场", crop: "番茄", variety: "辽红8号", greenhouseArea: 95, interGreenArea: 15, arableArea: 125, actualArea: 120, taskCount: 20, completionRate: 0.85, plotId: "G001" },
  ],
  "黄瓜": [
    { id: "G-C01", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "雨林分场", crop: "黄瓜", variety: "津优3号", greenhouseArea: 78, interGreenArea: 10, arableArea: 100, actualArea: 96, taskCount: 16, completionRate: 0.88, plotId: "G002" },
    { id: "G-C02", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", crop: "黄瓜", variety: "津绿4号", greenhouseArea: 62, interGreenArea: 8, arableArea: 80, actualArea: 75, taskCount: 10, completionRate: 0.80, plotId: "G002" },
  ],
  "草莓": [
    { id: "G-S01", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "康保分场", crop: "草莓", variety: "红颜", greenhouseArea: 62, interGreenArea: 5, arableArea: 75, actualArea: 70, taskCount: 12, completionRate: 0.92, plotId: "G003" },
    { id: "G-S02", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", crop: "草莓", variety: "章姬", greenhouseArea: 55, interGreenArea: 5, arableArea: 70, actualArea: 65, taskCount: 10, completionRate: 0.90, plotId: "G003" },
  ],
  "辣椒": [
    { id: "G-L01", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "兴城分场", crop: "辣椒", variety: "辽椒5号", greenhouseArea: 70, interGreenArea: 10, arableArea: 90, actualArea: 85, taskCount: 14, completionRate: 0.86, plotId: "G004" },
    { id: "G-L02", regionCompany: "沈阳公司", farm: "长春农场", branch: "九台分场", crop: "辣椒", variety: "湘研15", greenhouseArea: 50, interGreenArea: 8, arableArea: 65, actualArea: 60, taskCount: 8, completionRate: 0.75, plotId: "G004" },
  ],
  "茄子": [
    { id: "G-Q01", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", crop: "茄子", variety: "辽茄7号", greenhouseArea: 60, interGreenArea: 8, arableArea: 78, actualArea: 72, taskCount: 10, completionRate: 0.80, plotId: "G005" },
    { id: "G-Q02", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "白云分场", crop: "茄子", variety: "黑秀丽", greenhouseArea: 50, interGreenArea: 6, arableArea: 65, actualArea: 60, taskCount: 8, completionRate: 0.88, plotId: "G005" },
  ],
  "西瓜": [
    { id: "G-X01", regionCompany: "沈阳公司", farm: "长春农场", branch: "九台分场", crop: "西瓜", variety: "京欣1号", greenhouseArea: 50, interGreenArea: 5, arableArea: 62, actualArea: 56, taskCount: 6, completionRate: 0.83, plotId: "G006" },
    { id: "G-X02", regionCompany: "沈阳公司", farm: "长春农场", branch: "梅河口分场", crop: "西瓜", variety: "甜王3号", greenhouseArea: 52, interGreenArea: 5, arableArea: 68, actualArea: 60, taskCount: 5, completionRate: 1.0, plotId: "G006" },
  ],
}

export const fieldSubList: Record<string, FieldSubRecord[]> = {
  "F-R01": [
    { id: "F-R01-1", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "东区", crop: "水稻", variety: "龙粳31", plannedArea: 450, actualArea: 440, taskCount: 7, completionRate: 0.86, plotId: "P001" },
    { id: "F-R01-2", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "西区", crop: "水稻", variety: "龙粳31", plannedArea: 350, actualArea: 340, taskCount: 5, completionRate: 1.0, plotId: "P001" },
  ],
  "F-R02": [
    { id: "F-R02-1", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", unit: "一区", crop: "水稻", variety: "松粳22", plannedArea: 600, actualArea: 580, taskCount: 8, completionRate: 0.88, plotId: "P001" },
    { id: "F-R02-2", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", unit: "二区", crop: "水稻", variety: "松粳22", plannedArea: 600, actualArea: 570, taskCount: 7, completionRate: 0.86, plotId: "P001" },
  ],
  "F-W01": [
    { id: "F-W01-1", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "甲区", crop: "小麦", variety: "龙麦33", plannedArea: 320, actualArea: 310, taskCount: 4, completionRate: 1.0, plotId: "P002" },
    { id: "F-W01-2", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "乙区", crop: "小麦", variety: "龙麦33", plannedArea: 280, actualArea: 270, taskCount: 4, completionRate: 0.75, plotId: "P002" },
  ],
  "F-C01": [
    { id: "F-C01-1", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", unit: "I区", crop: "玉米", variety: "先玉335", plannedArea: 500, actualArea: 480, taskCount: 6, completionRate: 0.83, plotId: "P003" },
    { id: "F-C01-2", regionCompany: "哈尔滨公司", farm: "北安农场", branch: "红星分场", unit: "II区", crop: "玉米", variety: "先玉335", plannedArea: 500, actualArea: 480, taskCount: 6, completionRate: 0.83, plotId: "P003" },
  ],
  "F-S01": [
    { id: "F-S01-1", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "合发分场", unit: "南段", crop: "大豆", variety: "黑河43", plannedArea: 300, actualArea: 290, taskCount: 4, completionRate: 0.75, plotId: "P004" },
    { id: "F-S01-2", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "合发分场", unit: "北段", crop: "大豆", variety: "黑河43", plannedArea: 300, actualArea: 285, taskCount: 4, completionRate: 1.0, plotId: "P004" },
  ],
  "F-CT01": [
    { id: "F-CT01-1", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", unit: "A区", crop: "棉花", variety: "辽棉17", plannedArea: 260, actualArea: 250, taskCount: 4, completionRate: 1.0, plotId: "P005" },
    { id: "F-CT01-2", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", unit: "B区", crop: "棉花", variety: "辽棉17", plannedArea: 240, actualArea: 230, taskCount: 3, completionRate: 0.67, plotId: "P005" },
  ],
  "F-Y01": [
    { id: "F-Y01-1", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "白云分场", unit: "南区", crop: "油菜", variety: "青杂5号", plannedArea: 200, actualArea: 195, taskCount: 3, completionRate: 1.0, plotId: "P008" },
    { id: "F-Y01-2", regionCompany: "哈尔滨公司", farm: "嫩江农场", branch: "白云分场", unit: "北区", crop: "油菜", variety: "青杂5号", plannedArea: 200, actualArea: 190, taskCount: 2, completionRate: 1.0, plotId: "P008" },
  ],
  "F-H01": [
    { id: "F-H01-1", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "东侧地", crop: "花生", variety: "四粒红", plannedArea: 150, actualArea: 145, taskCount: 2, completionRate: 1.0, plotId: "P006" },
    { id: "F-H01-2", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "西侧地", crop: "花生", variety: "四粒红", plannedArea: 150, actualArea: 140, taskCount: 2, completionRate: 1.0, plotId: "P006" },
  ],
  "F-HS01": [
    { id: "F-HS01-1", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "雨林分场", unit: "北段", crop: "红薯", variety: "烟薯25", plannedArea: 100, actualArea: 95, taskCount: 2, completionRate: 1.0, plotId: "P007" },
    { id: "F-HS01-2", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "雨林分场", unit: "南段", crop: "红薯", variety: "烟薯25", plannedArea: 100, actualArea: 95, taskCount: 1, completionRate: 1.0, plotId: "P007" },
  ],
}

export const facilitySubList: Record<string, FacilitySubRecord[]> = {
  "G-T01": [
    { id: "G-T01-1", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "1号温室", crop: "番茄", variety: "粉太郎", greenhouseArea: 30, interGreenArea: 4, arableArea: 40, actualArea: 38, taskCount: 6, completionRate: 0.83, plotId: "G001" },
    { id: "G-T01-2", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "华山分场", unit: "2号温室", crop: "番茄", variety: "粉太郎", greenhouseArea: 55, interGreenArea: 8, arableArea: 70, actualArea: 67, taskCount: 12, completionRate: 0.92, plotId: "G001" },
  ],
  "G-C01": [
    { id: "G-C01-1", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "雨林分场", unit: "东棚", crop: "黄瓜", variety: "津优3号", greenhouseArea: 40, interGreenArea: 5, arableArea: 52, actualArea: 48, taskCount: 8, completionRate: 0.88, plotId: "G002" },
    { id: "G-C01-2", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "雨林分场", unit: "西棚", crop: "黄瓜", variety: "津优3号", greenhouseArea: 38, interGreenArea: 5, arableArea: 48, actualArea: 44, taskCount: 8, completionRate: 0.88, plotId: "G002" },
  ],
  "G-S01": [
    { id: "G-S01-1", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "康保分场", unit: "A棚", crop: "草莓", variety: "红颜", greenhouseArea: 32, interGreenArea: 3, arableArea: 38, actualArea: 36, taskCount: 6, completionRate: 1.0, plotId: "G003" },
    { id: "G-S01-2", regionCompany: "哈尔滨公司", farm: "华康农场", branch: "康保分场", unit: "B棚", crop: "草莓", variety: "红颜", greenhouseArea: 30, interGreenArea: 2, arableArea: 37, actualArea: 34, taskCount: 6, completionRate: 0.83, plotId: "G003" },
  ],
  "G-L01": [
    { id: "G-L01-1", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "兴城分场", unit: "1号棚", crop: "辣椒", variety: "辽椒5号", greenhouseArea: 38, interGreenArea: 5, arableArea: 50, actualArea: 46, taskCount: 7, completionRate: 0.86, plotId: "G004" },
    { id: "G-L01-2", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "兴城分场", unit: "2号棚", crop: "辣椒", variety: "辽椒5号", greenhouseArea: 32, interGreenArea: 5, arableArea: 40, actualArea: 39, taskCount: 7, completionRate: 0.86, plotId: "G004" },
  ],
  "G-Q01": [
    { id: "G-Q01-1", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", unit: "甲棚", crop: "茄子", variety: "辽茄7号", greenhouseArea: 32, interGreenArea: 4, arableArea: 42, actualArea: 38, taskCount: 6, completionRate: 0.83, plotId: "G005" },
    { id: "G-Q01-2", regionCompany: "沈阳公司", farm: "盘锦农场", branch: "红海滩分场", unit: "乙棚", crop: "茄子", variety: "辽茄7号", greenhouseArea: 28, interGreenArea: 4, arableArea: 36, actualArea: 34, taskCount: 4, completionRate: 0.75, plotId: "G005" },
  ],
  "G-X01": [
    { id: "G-X01-1", regionCompany: "沈阳公司", farm: "长春农场", branch: "九台分场", unit: "暖棚1", crop: "西瓜", variety: "京欣1号", greenhouseArea: 28, interGreenArea: 3, arableArea: 36, actualArea: 32, taskCount: 4, completionRate: 1.0, plotId: "G006" },
    { id: "G-X01-2", regionCompany: "沈阳公司", farm: "长春农场", branch: "九台分场", unit: "暖棚2", crop: "西瓜", variety: "京欣1号", greenhouseArea: 22, interGreenArea: 2, arableArea: 26, actualArea: 24, taskCount: 2, completionRate: 1.0, plotId: "G006" },
  ],
}

export const orgTree: TreeNode[] = [{
  label: "中国融通农业发展集团有限公司",
  value: "root",
  children: [{
    label: "哈尔滨公司",
    value: "hrb",
    children: [{
      label: "华康农场",
      value: "huakang",
      children: [
        { label: "华山分场", value: "huashan" },
        { label: "雨林分场", value: "yulin" },
        { label: "康保分场", value: "kangbao" },
      ]
    }, {
      label: "北安农场",
      value: "beian",
      children: [
        { label: "红星分场", value: "hongxing" },
        { label: "兴安分场", value: "xingan" },
        { label: "永丰分场", value: "yongfeng" },
      ]
    }, {
      label: "嫩江农场",
      value: "nenjiang",
      children: [
        { label: "合发分场", value: "hefa" },
        { label: "白云分场", value: "baiyun" },
      ]
    }]
  }, {
    label: "沈阳公司",
    value: "sy",
    children: [{
      label: "盘锦农场",
      value: "panjin",
      children: [
        { label: "兴城分场", value: "xingcheng" },
        { label: "红海滩分场", value: "honghaitan" },
      ]
    }, {
      label: "长春农场",
      value: "changchun",
      children: [
        { label: "九台分场", value: "jiutai" },
        { label: "梅河口分场", value: "meihekou" },
      ]
    }]
  }]
}]
