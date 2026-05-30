"use strict";

/**
 * Outfit suggestion tailored for the user (158cm / 64kg, pear-shaped, female),
 * picked by the day's high temperature. Pear-shape styling principles woven in:
 *  - 高腰下著拉長腿部比例
 *  - A 字裙 / 直筒・寬褲，深色下身修飾臀腿
 *  - 上半身選亮色或有細節，把視覺重心往上帶
 *  - 避免緊身、淺色或大面積花紋的下著
 *
 * @param {number|null} maxTemp
 * @returns {string}
 */
function outfitSuggestion(maxTemp) {
  if (maxTemp == null) {
    return "高腰寬褲或A字裙＋合身上衣，深色下身修飾、上身選亮色吸睛，再帶件薄外套備用。";
  }
  if (maxTemp >= 30) {
    return "寬鬆短袖或雪紡上衣＋高腰A字裙／寬褲（深色下身修飾梨形、上身選亮色或小細節吸睛），透氣材質為主，進冷氣房可加一件薄罩衫。";
  }
  if (maxTemp >= 26) {
    return "短袖／無袖上衣＋高腰寬褲或A字裙，上身亮色、下身深色顯瘦，搭一件薄外套進冷氣房。";
  }
  if (maxTemp >= 22) {
    return "薄長袖或針織上衣＋高腰直筒褲，深色下身修飾，可披一件薄外套，早晚剛好。";
  }
  if (maxTemp >= 18) {
    return "長袖＋薄針織外套，高腰寬褲拉長比例、深色下身顯瘦，可加圍巾把焦點往上帶。";
  }
  return "厚針織或大衣＋內搭，深色高腰長褲或直筒褲顯瘦，靴子收尾，注意保暖。";
}

module.exports = { outfitSuggestion };
