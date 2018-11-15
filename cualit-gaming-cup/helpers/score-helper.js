let _ = require('underscore')

module.exports = {
  normalizeScore: function(score, maxScore) {
    if(!maxScore) return 0
    return parseFloat((score / maxScore * 100).toFixed(2))
  }
}
