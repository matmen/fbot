/* global angular Chart */
const app = angular.module('fbot', ['ngRoute', 'ngSanitize']);

app.config(($routeProvider, $locationProvider) => {

	$routeProvider.when('/', {
		templateUrl: '/pages/index.html'
	}).when('/added', {
		templateUrl: '/pages/added.html'
	}).when('/stats', {
		templateUrl: '/pages/stats.html'
	}).when('/commands/', {
		templateUrl: '/pages/commands.html'
	}).when('/commands/:category', {
		templateUrl: '/pages/commands-category.html'
	}).when('/settings', {
		templateUrl: '/pages/settings.html'
	}).otherwise({
		templateUrl: '/pages/404.html'
	});

	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('');

});

app.controller('StatsController', ($scope, $http) => {
	$http({
		method: 'GET',
		url: '/api/bot'
	}).then((res) => {
		$scope.currentStats = res.data;
	});

	$http({
		method: 'GET',
		url: '/api/stats'
	}).then((res) => {

		const servers = [];
		const commandPercentages = [];

		for(const stat of res.data) {

			servers.push({
				x: parseInt(stat.time),
				y: parseInt(stat.servers)
			});

			commandPercentages.push({
				x: parseInt(stat.time),
				y: parseInt(stat.commands) / parseInt(stat.messages)
			});

		}

		new Chart('serversUsersCanvas', {
			type: 'line',
			data: {
				datasets: [{
					label: 'Servers',
					data: servers,
					backgroundColor: 'rgba(255, 0, 0, 0.3)'
				}]
			},
			options: graphOpts
		});

		new Chart('commandsPercentageCanvas', {
			type: 'line',
			data: {
				datasets: [{
					label: 'Commands/Messages Ratio',
					data: commandPercentages,
					backgroundColor: 'rgba(255, 128, 196, 0.3)'
				}]
			},
			options: graphOpts
		});

	});

});

app.controller('CommandHelpController', ($scope, $http, $routeParams) => {
	$http({
		method: 'GET',
		url: '/api/commands'
	}).then((res) => {
		$scope.commands = res.data;
		$scope.category = $routeParams.category.toUpperCase();
		$scope.isCategory = (command) => command.category.toLowerCase() === $routeParams.category;
	});
});

const graphOpts = {
	scales: {
		xAxes: [{
			type: 'time'
		}]
	},
	maintainAspectRatio: false,
	elements: {
		point: {
			radius: 0
		}
	},
	hover: {
		mode: 'x',
		intersect: false
	}
};
