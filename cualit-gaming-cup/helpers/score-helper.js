let _ = require('underscore')

module.exports = {
  normalizeScore: function(score, maxScore) {
    return parseFloat((score / maxScore * 100).toFixed(2))
  }
}
