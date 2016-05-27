;(function(util){
    var _ = util;

    /*
    *@Object : Eventemitter
    *+ feature 事件分发对象，用于注册和触发自定义事件
    *~ fn : emit addListener 
    */
    function EventEmitter() {
        this._events = this._events || {};
    }

    EventEmitter.fn = EventEmitter.prototype = {
        constructor : EventEmitter,

        emit : function(type) {
            var events = this._events,
                handler = this._events[type],
                handlerIsArray = _.isArray(handler),
                handlerIsFunction = _.isFunction(handler),
                handlerIsUndefined = _.isUndefined(hanlder),
                args = _.slice(_.ToArray(arguments), 1),
                i, len;
            if( !events ) {
                return false;
            }

            if( handlerIsUndefined ) {
                return false;
            }

            if( handlerIsFunction ) {
                handler.apply(this, args);
            }

            if( handlerIsArray ) {
                for(i = 0, len = handler.length; i < len; i++) {
                    if(handler[i].apply(this, args) === false ) {
                        return false;
                    }
                }
            }

            return true;
        },

        addListener : function(type, listener) {
            var events = this._events || ( this._events = {} ),
                eveObj = this._events[ type ],
                eveObjIsUndefined = _.isUndefined( eveObj ),
                eveObjIsFunction  = _.isFunction( eveObj ),
                eveObjIsArray     = _.isArray( eveObj ),
                listenerIsFunction = _.isFunction( listener );

            if( !listenerIsFunction ) {
                throw TypeError( "listener must be a function" );
            }

            if( eveObjIsUndefined ) {
                this._event[ type ] = listener;
            }

            if( eveObjIsFunction ) {
                this._event[ type ] = [ eveObj, listener ];
            }

            if( eveObjIsArray ) {
                this._event[ type ].push( listener );
            }

            return this;
        },

        removeListener : function(type, listener) {
            var events = this._events || ( this._events = {} ),
                eveObj = events[ type ],
                eveObjIsUndefined = _.isUndefined( eveObj ),
                eveObjIsFunction  = _.isFunction( eveObj ),
                eveObjIsArray     = _.isArray( eveObj ),
                listenerIsFunction = _.isFunction( listener ),
                i, l;

            if( !listenerIsFunction ) {
                    throw TypeError( 'listener must be a function' );
            }

            if( !events || eveObjIsUndefined) return this;

            if( eveObjIsFunction && eveObj === listener ) {
                delete this._events[ type ];

                if( this.removeListener ) {
                    this.emit('removeListener', type, listener);
                }
            }else if( eveObjIsArray ) {
                i = 0, len = eveObj.length;

                if( len === 1 ) {
                    eveObj.length = 0;
                    delete this._events[ type ];
                    return this;
                }

                for( ; i < len; i++ ) {
                    if( eveObj[i] === listener ) {
                        eveObj.splice(i, 1);
                        break;
                    }
                }

                if( i == len ) {
                    return this;
                }

                if( this._events.removeListener ) {
                        this.emit( 'removeListener', type, listener );
                }
            }

            return this;
        }
    };

    EventEmitter.fn.on = EventEmitter.prototype.addListener;

    util.createEventEmitter = function() {
        if( !this.EventEmitterExit ) {
            this.EventEmitterExit = true;
            this.EventEmitter = new EventEmitter()
            return this.EventEmitter;
        }
        console.error("EventEmitter实例已经存在");
        return this.EventEmitter;
    }

})(util);