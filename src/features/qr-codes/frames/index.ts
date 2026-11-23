import type { ComponentType } from "react";
import type { QrFrameRenderProps } from "@/types";
import {
  ArchCard, AwningCard, BloomCard, BuntingCard, ClassicCard, DecoCard, HarbourCard, HopsCard, LaceCard,
  LaurelCard, MandalaCard, ScanTabCard, SprigCard, SteamCard, TagCard, TicketCard, TilesCard, TrattoriaCard,
  VineCard, WavesCard,
} from "./cards";
import {
  BananaLeafCard, CitrusCard, DinerCard, GildedCard, GrillCard, JharokhaCard, LanternCard, NorenCard, OliveCard, SpiceCard,
} from "./cardsCuisine";
import {
  ChalkboardCard, ConfettiCard, GeoCard, NewspaperCard, PolaroidCard, PostcardCard, RetroCard, RibbonCard, TerrazzoCard,
  ViewfinderCard,
} from "./cardsModern";
import {
  BotanicalCard, ChocoCard, CrateCard, DripsCard, FoamCard, KulhadCard, NeonCard, WheatCard, WineLabelCard,
} from "./cardsSweetBar";
import {
  BauhausCard, BoardingPassCard, FoodTruckCard, GinghamCard, MarqueeCard, MemphisCard, NightSkyCard, ReceiptCard, SplitCard,
  StitchedCard,
} from "./cardsGraphic";
import {
  CheeseCard, CoasterCard, HamperCard, LatteCard, MacaronCard, MartiniCard, MithaiCard, ScoopCard, SprinklesCard,
} from "./cardsTreats";
import {
  ArabesqueCard, BambooCard, ButcherCard, KolamCard, PapelCard, RopeCard, SakuraCard, ThaliCard,
} from "./cardsWorld";
import { BadgeSticker, BubbleSticker, BurstSticker, SealSticker, StampSticker, TabSticker } from "./stickers";
import {
  ArchSticker, DiamondSticker, FlowerSticker, HeartSticker, HexSticker, LabelSticker, PriceTagSticker, RingSticker,
  ShieldSticker, TicketSticker,
} from "./stickersMore";
import {
  BlobSticker, CloudSticker, CupSticker, LuggageTagSticker, OctagonSticker, PhoneSticker, PintSticker, RosetteSticker,
  ScrollSticker, SplitCircleSticker, SquircleSticker, SunSticker,
} from "./stickersExtra";

/** The artwork for a frame id from QR_FRAMES (src/constants/qrCodes.constants.ts). */
export function frameRenderer(id: string): ComponentType<QrFrameRenderProps> | null {
  switch (id) {
    // Cards: any business
    case "classic": return ClassicCard;
    case "scan-tab": return ScanTabCard;
    case "arch": return ArchCard;
    case "ticket": return TicketCard;
    case "bloom": return BloomCard;
    case "viewfinder": return ViewfinderCard;
    case "geo": return GeoCard;
    case "polaroid": return PolaroidCard;
    case "postcard": return PostcardCard;
    case "ribbon": return RibbonCard;
    case "terrazzo": return TerrazzoCard;
    case "retro": return RetroCard;
    case "newspaper": return NewspaperCard;
    case "confetti": return ConfettiCard;
    case "chalkboard": return ChalkboardCard;
    case "bauhaus": return BauhausCard;
    case "memphis": return MemphisCard;
    case "receipt": return ReceiptCard;
    case "boarding-pass": return BoardingPassCard;
    case "marquee": return MarqueeCard;
    case "night-sky": return NightSkyCard;
    case "stitched": return StitchedCard;
    case "gingham": return GinghamCard;
    case "split": return SplitCard;
    // Cards: restaurants and quick service
    case "trattoria": return TrattoriaCard;
    case "deco": return DecoCard;
    case "mandala": return MandalaCard;
    case "waves": return WavesCard;
    case "tiles": return TilesCard;
    case "bunting": return BuntingCard;
    case "harbour": return HarbourCard;
    case "awning": return AwningCard;
    case "sprig": return SprigCard;
    case "noren": return NorenCard;
    case "lantern": return LanternCard;
    case "spice": return SpiceCard;
    case "banana-leaf": return BananaLeafCard;
    case "jharokha": return JharokhaCard;
    case "olive": return OliveCard;
    case "grill": return GrillCard;
    case "gilded": return GildedCard;
    case "diner": return DinerCard;
    case "citrus": return CitrusCard;
    case "food-truck": return FoodTruckCard;
    case "sakura": return SakuraCard;
    case "papel": return PapelCard;
    case "kolam": return KolamCard;
    case "arabesque": return ArabesqueCard;
    case "rope": return RopeCard;
    case "thali": return ThaliCard;
    case "bamboo": return BambooCard;
    case "butcher": return ButcherCard;
    // Cards: cafés, sweets, bars, shops
    case "steam": return SteamCard;
    case "lace": return LaceCard;
    case "laurel": return LaurelCard;
    case "hops": return HopsCard;
    case "vine": return VineCard;
    case "tag": return TagCard;
    case "drips": return DripsCard;
    case "wheat": return WheatCard;
    case "botanical": return BotanicalCard;
    case "kulhad": return KulhadCard;
    case "choco": return ChocoCard;
    case "neon": return NeonCard;
    case "foam": return FoamCard;
    case "wine-label": return WineLabelCard;
    case "crate": return CrateCard;
    case "latte": return LatteCard;
    case "sprinkles": return SprinklesCard;
    case "macaron": return MacaronCard;
    case "scoop": return ScoopCard;
    case "mithai": return MithaiCard;
    case "martini": return MartiniCard;
    case "coaster": return CoasterCard;
    case "cheese": return CheeseCard;
    case "hamper": return HamperCard;
    // Stickers
    case "badge": return BadgeSticker;
    case "sticker-tab": return TabSticker;
    case "seal": return SealSticker;
    case "bubble": return BubbleSticker;
    case "stamp": return StampSticker;
    case "burst": return BurstSticker;
    case "heart": return HeartSticker;
    case "hexagon": return HexSticker;
    case "arch-sticker": return ArchSticker;
    case "flower": return FlowerSticker;
    case "shield": return ShieldSticker;
    case "label": return LabelSticker;
    case "price-tag": return PriceTagSticker;
    case "diamond": return DiamondSticker;
    case "ring": return RingSticker;
    case "ticket-sticker": return TicketSticker;
    case "cloud": return CloudSticker;
    case "octagon": return OctagonSticker;
    case "cup": return CupSticker;
    case "blob": return BlobSticker;
    case "rosette": return RosetteSticker;
    case "sun": return SunSticker;
    case "pint": return PintSticker;
    case "phone": return PhoneSticker;
    case "luggage-tag": return LuggageTagSticker;
    case "squircle": return SquircleSticker;
    case "scroll": return ScrollSticker;
    case "split-circle": return SplitCircleSticker;
    default: return null;
  }
}
