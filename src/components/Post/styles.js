import {StyleSheet, Dimensions} from  'react-native';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: Dimensions.get('window').height // scale the image according to your screen height,
	},
	video: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	uiContainer: {
		height:'100%',
		justifyContent: 'flex-end',
	},
	handle: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 5,
	},
	description: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '300',
		marginBottom: 3,
	},
	bottomContainer: {
		height:200,
		padding: 10,
		marginBottom:50,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	songRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	downloadRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	downloadImage: {
		width: 40,
		height: 40,
		borderRadius: 25,
		borderWidth: 2,
		borderColor: 'white'
	},
	requestedBy: {
		color: '#fff',
		fontSize: 16,
		marginLeft: 5,
	},
	// right container
	rightContainer: {
		alignSelf: 'flex-end',
		height: 240,
		justifyContent: 'space-between',
		marginRight: 10,
		marginBottom: -210,
	},
	profilePicture: {
		width: 50,
		height: 50,
		borderRadius: 25,
		borderWidth: 2,
		borderColor: '#fff'
	},
	statsLabel: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '500',
		marginTop: 3,
	},
	iconContainer: {
		alignItems: 'center'
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// marginTop: 22
	},
	modalView: {
		marginTop: 'auto',
		//margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		height: '65%',
		width: Dimensions.get("window").width - 5,
		//alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center"
	}
});

export default styles;