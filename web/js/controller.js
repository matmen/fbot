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
		const users = [];
		const messages = [];
		const commands = [];
		const channels = [];

		for(const stat of res.data) {

			servers.push({
				x: parseInt(stat.time),
				y: parseInt(stat.servers)
			});

			users.push({
				x: parseInt(stat.time),
				y: parseInt(stat.users)
			});

			messages.push({
				x: parseInt(stat.time),
				y: parseInt(stat.messages)
			});

			commands.push({
				x: parseInt(stat.time),
				y: parseInt(stat.commands)
			});

			channels.push({
				x: parseInt(stat.time),
				y: parseInt(stat.channels)
			});

		}

		new Chart('serversUsersCanvas', {
			type: 'line',
			data: {
				datasets: [{
					label: 'Servers',
					data: servers,
					backgroundColor: 'rgba(255, 0, 0, 0.3)'
				}, {
					label: 'Users',
					data: users,
					backgroundColor: 'rgba(196, 64, 64, 0.3)'
				}]
			},
			options: graphOpts
		});

		new Chart('messagesCommandsCanvas', {
			type: 'line',
			data: {
				datasets: [{
					label: 'Messages Received',
					data: messages,
					backgroundColor: 'rgba(255, 128, 0, 0.3)'
				}, {
					label: 'Command Used',
					data: commands,
					backgroundColor: 'rgba(196, 64, 0, 0.3)'
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
