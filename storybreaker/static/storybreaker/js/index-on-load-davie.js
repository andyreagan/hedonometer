var degrees = 180 / Math.PI,
    width = 1000,
    height = 600;

var loader = d3.dispatch("world"), id = -1;

d3.select("#map01")
    .data([
      orthographicProjection(width, height)
          .scale(245)
          .translate([width / 2, height * .56]),
    ])
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .each(function(projection) {
      var path = d3.geo.projection(projection),
          svg = d3.select(this).call(drawMap, path, true);
      svg.selectAll(".foreground")
          .call(d3.geo.zoom().projection(projection)
            .scaleExtent([projection.scale() * .7, projection.scale() * 10])
            .on("zoom.redraw", function() {
              d3.event.sourceEvent.preventDefault();
              svg.selectAll("path").attr("d", path);
            }));
      loader.on("world." + ++id, function() { svg.selectAll("path").attr("d", path); });
    });

(function() {
  var width = 350, height = 350,
      projection0 = orthographicProjection(width, height),
      projection1 = orthographicProjection(width, height),
      path0 = d3.geo.projection(projection0),
      path1 = d3.geo.projection(projection1);

  var comparison0 = d3.select("#comparison").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(drawMap, path0, true);
  comparison0.selectAll(".foreground")
      .call(d3.behavior.drag()
        .origin(function() { var r = projection0.rotate(); return {x: r[0], y: -r[1]}; })
        .on("drag", function() {
          projection0.rotate([d3.event.x, -d3.event.y]);
          comparison0.selectAll("path").attr("d", path0);
        }));

  var comparison1 = d3.select("#comparison").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(drawMap, path1, true);
  comparison1.selectAll(".foreground")
      .call(d3.geo.zoom().projection(projection1)
        .on("zoom", redrawComparison1));

  loader.on("world.comparison0", function() { comparison0.selectAll("path").attr("d", path0); });
  loader.on("world.comparison1", redrawComparison1);

  function redrawComparison1() { comparison1.selectAll("path").attr("d", path1); }
})();

(function() {
  var projections = [],
      width = 220,
      height = 220,
      format = d3.format(".1f");

  rotationMap("γ", function(rotate) {
    var x1 = d3.event.x - width / 2,
        y1 = height / 2 - d3.event.y;
    return rotate[2] += (Math.atan2(y1, x1) - Math.atan2(y1 + d3.event.dy, x1 - d3.event.dx)) * degrees;
  });
  rotationMap("φ", function(rotate) { return rotate[1] = -d3.event.y; }, function(rotate) { return {y: -rotate[1]}; });
  rotationMap("λ", function(rotate) { return rotate[0] = d3.event.x; }, function(rotate) { return {x: rotate[0]}; });

  function rotationMap(symbol, update, origin) {
    var projection = orthographicProjection(width, height).rotate([0, 0]),
        path = d3.geo.projection(projection);

    projections.push(projection);

    var projections_ = projections.slice();

    var svg = d3.select("#rotations").insert("svg", "*")
        .datum({path: path})
        .attr("width", width)
        .attr("height", height + 20)
        .call(drawMap, path);

    var text = svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 10)
        .attr("text-anchor", "middle")
        .text(symbol + "=0°");

    loader.on("world." + ++id, function() { svg.selectAll("path").attr("d", path); });

    var drag = d3.behavior.drag()
        .on("drag", function() {
          for (var i = 0; i < projections_.length; ++i) {
            var projection = projections_[i],
                angle = rotate(projection.rotate());
            projection.rotate(angle.rotate);
          }
          text.text(symbol + "=" + format(angle.angle) + "°")
          d3.select("#rotations").selectAll("svg").each(function(d) {
            d3.select(this).selectAll("path").attr("d", d.path);
          });
        });

    if (origin) drag.origin(function() { return origin(projection.rotate()); });

    svg.selectAll(".foreground").call(drag);

    function rotate(rotate) { var angle = update(rotate); return {angle: angle, rotate: rotate}; }
  }
})();

d3.json("/static/storybreaker/data/world-110m.json", function(error, world) {
  d3.selectAll("svg").insert("path", ".foreground")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land");
  d3.selectAll("svg").insert("path", ".foreground")
      .datum(topojson.mesh(world, world.objects.countries))
      .attr("class", "mesh");
  loader.world();
});

function drawMap(svg, path, mousePoint) {
  var projection = path;

  svg.append("path")
      .datum(d3.geo.graticule())
      .attr("class", "graticule")
      .attr("d", path);

  svg.append("path")
      .datum({type: "Sphere"})
      .attr("class", "foreground")
      .attr("d", path)
      .on("mousedown.grab", function() {
        var point;
        if (mousePoint) point = svg.insert("path", ".foreground")
            .datum({type: "Point", coordinates: projection.invert(d3.mouse(this))})
            .attr("class", "point")
            .attr("d", path);
        var path = d3.select(this).classed("zooming", true),
            w = d3.select(window).on("mouseup.grab", function() {
              path.classed("zooming", false);
              w.on("mouseup.grab", null);
              if (mousePoint) point.remove();
            });
      });
}

function orthographicProjection(width, height) {
  return d3.geo.orthographic()
      .precision(.5)
      .clipAngle(90)
      .clipExtent([[1, 1], [width - 1, height - 1]])
      .translate([width / 2, height / 2])
      .scale(width / 2 - 10)
      .rotate([0, -30]);
}
